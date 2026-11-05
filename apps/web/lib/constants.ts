// Pagination constants
export const QUESTIONS_PER_PAGE = 10;

// Intersection Observer constants
export const INTERSECTION_THRESHOLD = 0.1;

// Debounce delays (in milliseconds)
export const SEARCH_DEBOUNCE_DELAY = 300;
export const VOTE_DEBOUNCE_DELAY = 500;

// Dates: relative within the last week, then a short calendar date
export const RELATIVE_DATE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const SHORT_DATE_FORMAT = "MMM D, YYYY";
export const EXACT_DATE_TIME_FORMAT = "MMM D, YYYY h:mm A";

export const EDITOR_IMAGE_MIN_PX = 48;
export const EDITOR_IMAGE_MAX_PX = 1024;
export const EDITOR_IMAGE_MAX_BYTES = 1024 * 1024;
export const EDITOR_IMAGE_UPLOAD_WINDOW_MS = 60 * 1000;
export const EDITOR_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
