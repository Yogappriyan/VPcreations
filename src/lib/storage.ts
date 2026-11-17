const DB_NAME = 'vp_portfolio_db';
const DB_VERSION = 1;
const STORE_NAME = 'keyval';

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB unavailable, using localStorage fallback:', request.error);
        resolve(null);
      };
    } catch (err) {
      console.warn('IndexedDB open failed:', err);
      resolve(null);
    }
  });

  return dbPromise;
}

export async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbSet<T>(key: string, value: T): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn('IndexedDB write failed:', req.error);
        resolve(false);
      };
    } catch (err) {
      console.warn('IndexedDB transaction failed:', err);
      resolve(false);
    }
  });
}

export async function idbDelete(key: string): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Unsupported or corrupted image file.'));
    img.src = src;
  });
}

function renderCompressedCanvas(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  quality: number
): string {
  let { width, height } = img;
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Fill dark slate background for transparent PNGs converted to JPEG
  ctx.fillStyle = '#040711';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Compresses any data:image/* string so each image stays compact (~60–140 KB),
 * preventing both localStorage 5MB quota overflows and Firestore 1MB document limits.
 */
export async function compressDataUrlIfOversized(
  dataUrl: string,
  targetMaxChars = 160_000
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  // Leave small images and SVGs untouched
  if (dataUrl.startsWith('data:image/svg+xml') || dataUrl.length <= targetMaxChars) {
    return dataUrl;
  }

  try {
    const img = await loadImageElement(dataUrl);
    const presets: Array<[number, number, number]> = [
      [960, 720, 0.78],
      [800, 600, 0.68],
      [680, 510, 0.58],
      [560, 420, 0.5]
    ];

    let best = dataUrl;
    for (const [w, h, q] of presets) {
      const candidate = renderCompressedCanvas(img, w, h, q);
      if (candidate) {
        best = candidate;
        if (candidate.length <= targetMaxChars) {
          return candidate;
        }
      }
    }
    return best;
  } catch (err) {
    console.warn('Could not recompress image data URL:', err);
    return dataUrl;
  }
}

export async function compressImageFileToDataUrl(file: File): Promise<string> {
  if (file.type === 'image/svg+xml' || (file.type === 'image/gif' && file.size < 180_000)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

  // Always run canvas compression for raster uploads to strip ICC/EXIF bloat and bound dimensions
  return compressDataUrlIfOversized(rawDataUrl, 140_000);
}
