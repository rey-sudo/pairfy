import { logger, ISO31661Alpha2Countries, categories } from "@lovelacers/common";
import sanitizeHtml from "sanitize-html";

export const catchError = (error?: any) => {
  logger.error(`EXIT=>${error}`);

  return process.exit(1);
};

/** ISO 3166-1 alpha-2. */
export const ISOCountries = ISO31661Alpha2Countries.map(
  (country: any) => country.code
);

export const categoryCodes = Object.values(categories).map(
  (item: any) => item.code
);

export function applyDiscount(price: number, percentage: number): number {
  if (typeof price !== "number" || !Number.isInteger(price) || price < 0) {
    return 0;
  }

  if (typeof percentage !== "number" || percentage < 0 || percentage > 100) {
    return price;
  }

  const discount = (price * percentage) / 100;
  return Math.floor(price - discount);
}

export function sanitizeTiptapContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "u",
      "strike",
      "a",
      "img",
      "br",
      "hr",
      "div",
      "span",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}

export function normalizeTextForEmbedding(plainText: string): string {
  let normalized = plainText
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  normalized = normalized.toLowerCase();

  return normalized;
}

export const extractTextFromHTML = (html: string): string => {
  const plainText = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  return normalizeTextForEmbedding(plainText);
};
