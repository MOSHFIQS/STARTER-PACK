/**
 * Generate a URL-friendly slug from a string.
 */
export function generateSlug(text: string): string {
     return text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug.
 *
 * If an async `isUnique` checker is provided, the function will try the base
 * slug first and append incremental suffixes (-2, -3, ...) until a unique slug
 * is found. If no checker is provided, a short random suffix is appended.
 */
export async function generateUniqueSlug(
     text: string,
     isUnique?: (slug: string) => Promise<boolean>,
): Promise<string> {
     const base = generateSlug(text);

     if (!isUnique) {
          const suffix = Math.random().toString(36).substring(2, 8);
          return `${base}-${suffix}`;
     }

     // Try the base slug first
     if (await isUnique(base)) {
          return base;
     }

     // Append incremental numeric suffixes until unique
     let counter = 2;
     // eslint-disable-next-line no-constant-condition
     while (true) {
          const candidate = `${base}-${counter}`;
          if (await isUnique(candidate)) {
               return candidate;
          }
          counter++;
          // Safety guard to avoid infinite loops
          if (counter > 1000) {
               const random = Math.random().toString(36).substring(2, 8);
               return `${base}-${random}`;
          }
     }
}

/**
 * Generate a human-readable reference number (e.g. booking, inquiry).
 */
export function generateReferenceNumber(prefix: string): string {
     const timestamp = Date.now().toString().slice(-8);
     const random = Math.random().toString(36).substring(2, 6).toUpperCase();
     return `${prefix}-${timestamp}-${random}`;
}
