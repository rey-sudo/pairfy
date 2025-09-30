// server/api/chat/stream.ts
import { createClient } from "redis";
import { throwRemoteError } from "~/server/utils/fetch";
import { defineEventHandler, createEventStream } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const query = getQuery(event);

    const channel = query.channel;
    if (!channel || typeof channel !== "string") {
      throw new Error("Missing or invalid channel");
    }

    const stream = createEventStream(event);
    const streamInterval = setInterval(
      () => stream.push(JSON.stringify({ listen: true })),
      10_000
    );

    const cookies = parseCookies(event);
    const sessionCookie = cookies.session;

    const subscriber = createClient({ url: config.redisChatBase });
    subscriber.on("error", console.error);
    await subscriber.connect();

    const result: any = await $fetch(
      config.serviceUserBase + "/api/user/current-user",
      {
        method: "GET",
        credentials: "include",
        headers: {
          'x-forwarded-for': event.context.clientIP,
          'Cookie': sessionCookie ? `session=${sessionCookie}` : "",
        },
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data));
        },
      }
    );

    const userData = result.data;

    if (userData) {
      const CHANNEL = channel.split(":");
      const session = `${CHANNEL[0]}:${userData.pubkeyhash}:${CHANNEL[2]}`;

      await subscriber.subscribe(`channel:${session}`, (message) => {
        stream.push(message);
      });
    }

    stream.onClosed(async () => {
      clearInterval(streamInterval);
      await subscriber.quit();
    });

    return stream.send();
  } catch (err: any) {
    throwRemoteError(err);
  }
});
