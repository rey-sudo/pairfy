export const useUploadMedia = async (media: { file: File }[]) => {
  const form = new FormData();

  for (const { file } of media) {
    form.append("files", file);
  }

  try {
    const response = await $fetch("/api/media/create-files", {
      method: "POST",
      body: form,
      credentials: "include",
      async onResponseError({ response }) {
        throw new Error(
          JSON.stringify(response._data?.data || "Unknown server error")
        );
      },
    });

    return response;
  } catch (error: any) {
    console.error("❌ Error uploading media:", error);
    throw error;
  }
};

export const useUpdateMedia = async (
  media: { id: string; file: File }[],
  mediaGroupId: string
) => {
  const form = new FormData();

  const fileIds: string[] = [];

  for (const { id, file } of media) {
    form.append("files", file);
    fileIds.push(id);
  }

  form.append("fileIds", JSON.stringify(fileIds));

  form.append("mediaGroupId", mediaGroupId);

  try {
    const response = await $fetch("/api/media/update-files", {
      method: "POST",
      body: form,
      credentials: "include",
      async onResponseError({ response }) {
        throw new Error(
          JSON.stringify(response._data?.data || "Unknown server error")
        );
      },
    });

    return response;
  } catch (error: any) {
    console.error("❌ Error uploading media:", error);
    throw error;
  }
};

export const useMediaUrl = (mediaPath: string): string => {
  const config = useRuntimeConfig();
  //console.log("[useMediaUrl] mediaCDNBase:", config.public.mediaCDNBase);

  const base = config.public.mediaCDNBase || "";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = mediaPath.startsWith("/")
    ? mediaPath
    : `/${mediaPath}`;

  return `${normalizedBase}${normalizedPath}`;
};
