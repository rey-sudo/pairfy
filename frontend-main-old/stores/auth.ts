export const useAuthStore = defineStore("auth", () => {
  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  type AssetPriceMap = {
    ADA: number;
    IUSD: number;
    USDM: number;
    USDA: number;
  };

  type NotificationMap = {
    unseen: any[];
    seen: any[];
  };

  const toastMessage = ref<ToastMessage | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const locationDialog = ref(false);

  const user = ref<any>(null);
  const isAuthenticated = ref(false);

  const authDrawer = ref(false);
  const userDrawer = ref(false);

  const country = ref<string | null>(null);
  const walletName = ref<string | null>(null);
 
  const prices = ref<AssetPriceMap>({
    ADA: 0.0,
    IUSD: 1.0,
    USDM: 1.0,
    USDA: 1.0,
  });

  const notifications = ref<NotificationMap>({
    unseen: [],
    seen: [],
  });

  const setNotifications = (data: any) => {
    if (!import.meta.client) return;

    notifications.value = data;
  };

  const setPrices = (priceData: AssetPriceMap) => {
    if (!import.meta.client) return;

    prices.value = priceData;
  };

  const checkLocation = () => {
    if (!import.meta.client) return;

    const storedCountry = localStorage.getItem("country");
    if (storedCountry) {
      country.value = storedCountry;
    } else {
      locationDialog.value = true;
    }
  };

  const setLocation = (value: string) => {
    if (!import.meta.client) return;

    localStorage.setItem("country", value);
    country.value = value;
    locationDialog.value = false;
  };

  const showToast = (message: string, type: ToastType, duration: number) => {
    if (!import.meta.client) return;

    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  const login = async (params: {
    signature: string;
    address: string;
    wallet_name: string;
    country: string;
    terms_accepted: boolean;
    password: string;
  }) => {
    if (!import.meta.client) return;

    loading.value = true;

    try {
      await $fetch("/api/user/login-user", {
        method: "POST",
        body: params,
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      await fetchUser();
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUser = async () => {
    if (!import.meta.client) return;

    try {
      const response: any = await $fetch("/api/user/current-user", {
        method: "GET",
        credentials: "include",
        async onResponseError({ response }) {
          throw new Error(JSON.stringify(response._data.data));
        },
      });

      const userData = response.data;

      if (userData) {
        user.value = userData;
        walletName.value = userData.wallet_name;
        isAuthenticated.value = true;
      }

      return userData;
    } catch (err: any) {
      console.error(err);

      isAuthenticated.value = false;
      user.value = null;
    }
  };

  const logout = async () => {
    if (!import.meta.client) return;

    try {
      await $fetch("/api/user/logout-user", {
        method: "GET",
        credentials: "include",
      });

      userDrawer.value = false;
    } catch (err: any) {
      throw err;
    } finally {
      isAuthenticated.value = false;
      user.value = null;
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    fetchUser,
    authDrawer,
    userDrawer,
    toastMessage,
    showToast,
    locationDialog,
    checkLocation,
    setLocation,
    country,
    walletName,
    setPrices,
    prices,
    notifications,
    setNotifications,
  };
});
