import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    prompt: null,
    result: [],
    filters: 0,
  }),
  actions: {
    setResultData(data: any) {
      this.result = data;
    },
    setPrompt(data: any) {
      this.prompt = data;
    },
    setFilters(data: any) {
      this.filters = data;
    },
    clear() {
      this.prompt = null;
      this.result = [];
    },
    clearFilters() {
      const router = useRouter();
      const route = useRoute();

      const newQuery: Record<string, any> = {};

      if (route.query.prompt) {
        newQuery.prompt = route.query.prompt;
      }

      if (route.query.vectorized) {
        newQuery.vectorized = route.query.vectorized;
      }

      router.replace({
        path: route.path,
        query: newQuery,
      });

      this.filters = 0;
    },
  },
});
