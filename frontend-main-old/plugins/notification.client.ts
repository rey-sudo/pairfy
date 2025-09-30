// plugins/notification.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";

export default defineNuxtPlugin(() => {
  const apolloClient = new ApolloClient({
    ssrMode: import.meta.server,
    link: new HttpLink({
      uri: "/api/notification/graphql",
      fetch,
      credentials: "include", 
    }),
    cache: new InMemoryCache(),
  });

  return {
    provide: {
      notificationClient: apolloClient,
    },
  };
});
