import { customAlphabet } from 'nanoid';
import slugify from 'slugify';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);
const MAX_BASE_LENGTH = 51;

export function createSlug(title: string) {
  const base = slugify(title, { lower: true, strict: true })
    .slice(0, MAX_BASE_LENGTH)
    .replace(/-+$/, ''); // truncation can leave a trailing hyphen

  return `${base || 'question'}-${nanoid()}`;
}
