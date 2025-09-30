import { format, formatDistanceToNow } from "date-fns";

export function truncateByWords(text: string, wordCount: number): string {
  if (!text || wordCount <= 0) return "";
  const words = text.trim().split(/\s+/);
  return words.slice(0, wordCount).join(" ");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDateYYMMDD(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatUSD(amount: number) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new TypeError("Amount must be a finite number");
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted.replace(/\$/g, "").trim();
}

export function truncateText(text: string, maxLength: number) {
  if (typeof text !== "string") return "";
  if (maxLength <= 3) return ".".repeat(maxLength);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + "...";
}

export function truncateMiddle(hash: string, length = 6) {
  if (typeof hash !== "string" || hash.length <= length * 2) {
    return hash;
  }

  const start = hash.slice(0, length);
  const end = hash.slice(-length);
  return `${start} ...... ${end}`;
}

export function timestampToDate(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export async function copyToClipboard(text: string) {
  if (!import.meta.client) return;

  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

/**15 February 2025 . 8:05 AM - 13 minutes ago*/
export function formatCompleteDate(timestamp: string | number, seg?: boolean) {
  if (!timestamp) return;

  if (seg) {
    timestamp = Number(timestamp) * 1000;
  }

  const date = new Date(timestamp);
  const formattedDate = format(date, "dd MMMM yyyy '·' h:mm a");
  let timeAgo = formatDistanceToNow(date, { addSuffix: true });
  timeAgo = timeAgo.replace(/^about /, "");
  return `${formattedDate} - ${timeAgo}`;
}

export function timeAgo(timestamp: number) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function formatCountdown(value: string) {
  if (!value) return;

  let [minutes, seconds] = value.split(":").map(Number);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;

  minutes = minutes % 60;

  minutes += Math.floor(seconds / 60);

  seconds = seconds % 60;

  minutes = Math.min(minutes, 99);

  return `${days}d : ${remainingHours}h : ${minutes}m : ${seconds}s`;
}

export function formatAssetQuantity(name: string, value: number) {
  if (name === "ADA") {
    const result = value / 1_000_000;

    return result.toFixed(2) + " " + name;
  }

  return value
}
