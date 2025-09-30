export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const body = await readBody(event);

  try {
    const response = await $fetch(config.serviceUserBase + "/api/user/login-user", {
      method: "POST",
      body,
      headers:{
         'x-forwarded-for': event.context.clientIP,
      },
      credentials: "include",
      async onResponse({ response }) {
        const setCookies = response.headers.getSetCookie?.();
        if (Array.isArray(setCookies)) {
          for (const cookie of setCookies) {
            appendHeader(event, "set-cookie", cookie);
          }
        }
      },

      async onResponseError({ response }) {
        throw new Error(JSON.stringify(response._data));
      },
    });

    return response;
  } catch (err: any) {
    throwRemoteError(err);
  }
});
