import {
  EXACT_DATE_TIME_FORMAT,
  RELATIVE_DATE_WINDOW_MS,
  SHORT_DATE_FORMAT,
} from "@/lib/constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/** "2 hours ago" within the last week, otherwise "MMM D, YYYY". */
export function formatCreatedAt(createdAt: Date | string) {
  const date = dayjs(createdAt);
  return Date.now() - date.valueOf() < RELATIVE_DATE_WINDOW_MS
    ? date.fromNow()
    : date.format(SHORT_DATE_FORMAT);
}

export function formatShortDate(createdAt: Date | string) {
  return dayjs(createdAt).format(SHORT_DATE_FORMAT);
}

export function formatExactDateTime(createdAt: Date | string) {
  return dayjs(createdAt).format(EXACT_DATE_TIME_FORMAT);
}

export function toDateTimeAttribute(createdAt: Date | string) {
  return dayjs(createdAt).toISOString();
}
