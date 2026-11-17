export function normalizeUrl(url?: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function extractDomain(url?: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  return trimmed
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '');
}

export function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function sanitizeWhatsappNumber(phone?: string): string {
  const digits = (phone || '917845292609').replace(/[^0-9]/g, '');
  return digits || '917845292609';
}

export function sanitizeForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        result[k] = sanitizeForFirestore(v);
      }
    }
    return result as T;
  }
  return value;
}

export function emitDataSync(key: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vp-storage-sync', { detail: { key } }));
  }
}
