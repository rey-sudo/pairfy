export const useOrderStore = defineStore("order", () => {
  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  const toastMessage = ref<ToastMessage | null>(null);

  const order = ref(null);
  const state = ref(null);
  const product = ref(null);
  const shipping = ref(null);
  const session = ref(null);
  const finished = ref(null);
  const pendingTx = ref(null);

  const countdown = ref(null);

  const showToast = (message: string, type: ToastType, duration: number) => {
    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  const setOrder = (data: any) => {
    const { order: orderData, product: productData, shipping: shippingData, address, session: sessionData } = data;

    order.value = orderData;
    state.value = orderData.contract_state;
    finished.value = orderData.finished;
    pendingTx.value = orderData.pending_tx;

    session.value = sessionData;

    if (productData) {
      product.value = JSON.parse(productData);
    }

    if (shippingData) {
      const parsedData = JSON.parse(shippingData);

      const unchunked = parsedData[0]?.json_metadata?.msg.join("");

      shipping.value = JSON.parse(unchunked);
    }

  };

  function clear() {
    order.value = null;
  }

  return {
    order,
    clear,
    state,
    setOrder,
    finished,
    toastMessage,
    showToast,
    pendingTx,
    product,
    session,
    countdown,
    shipping
  };
});
