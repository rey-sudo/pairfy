export default defineEventHandler(async (event) => {
  const raw = event.context.params?.path;
  const config = useRuntimeConfig();

  const path = typeof raw === "string"
    ? raw.split("/")
    : Array.isArray(raw)
      ? raw
      : [];

  if (path.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "Missing media path" });
  }

  if (path[0] === "get-file" && path.length === 1) {
    return { ok: true };
  }

  if (path[0] !== "groups" || path.length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Invalid media group path" });
  }

  const url = `${config.serviceMediaBase}/api/media/get-file/${path.join("/")}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: await res.text(),
    });
  }

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "application/octet-stream";

  return new Response(Buffer.from(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      'x-forwarded-for': event.context.clientIP,
    },
  });
});
