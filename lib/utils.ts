export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

export function formatUuid(cleanUuid: string): string {
  // If it's already a UUID with hyphens, return it
  if (cleanUuid.includes('-')) return cleanUuid;
  
  // If it's 32 chars hex, format it
  if (cleanUuid.length === 32) {
    return `${cleanUuid.slice(0, 8)}-${cleanUuid.slice(8, 12)}-${cleanUuid.slice(12, 16)}-${cleanUuid.slice(16, 20)}-${cleanUuid.slice(20)}`;
  }
  
  return cleanUuid;
}

export function createNoteSlug(title: string, id: string): string {
  const cleanId = id.replace(/-/g, '');
  const slug = slugify(title);
  return `${slug}-${cleanId}`;
}

export function extractIdFromSlug(slug: string): string {
  // The hash is the last 32 characters
  const potentialId = slug.slice(-32);
  return formatUuid(potentialId);
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora há pouco';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}sem atrás`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 2) return '1mes atrás';

  const isSameYear = now.getFullYear() === date.getFullYear();

  if (isSameYear) {
    const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return `${date.getDate()} de ${month}`;
  }

  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return `${date.getDate()} de ${month}. de ${date.getFullYear()}`;
}

export function formatFullDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} de ${month}. de ${year}, ${hours}:${minutes}`;
}
