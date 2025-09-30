export const useProductStore = defineStore("product", () => {
  type ToastType = "success" | "error" | "info" | "default";

  type ToastMessage = {
    message: string;
    type: ToastType;
    duration: number;
  };

  const product = ref(null);
  const media = ref([]);
  const book = ref(null);

  const cardanoDialog = ref(false);
  const price = ref<number | null>(null);

  const toastMessage = ref<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastType, duration: number) => {
    toastMessage.value = {
      message,
      type,
      duration,
    };
  };

  const setBook = (data: any) => {
    book.value = data
  };

  function showCardanoDialog(value: boolean) {
    cardanoDialog.value = value;
  }

  function setProduct(data: any) {
    const { product: productData, media: mediaData } = data;

    product.value = productData;
    media.value = mediaData;
    price.value = productData.discount
      ? productData.discount_value
      : productData.price;
  }

  function clear() {
    product.value = null;
    media.value = [];
  }

  return {
    product,
    media,
    clear,
    setProduct,
    toastMessage,
    showCardanoDialog,
    cardanoDialog,
    showToast,
    setBook,
    price,
    book,
  };
});
