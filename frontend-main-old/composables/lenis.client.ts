// composables/useLenisMultiple.ts
import Lenis from "lenis";

export function useLenisMultiple(refs: Ref<HTMLElement | null>[]) {
  const instances: Lenis[] = [];
  let isRunning = true;

  const createLenis = (wrapperEl: HTMLElement) => {
    const content = wrapperEl.firstElementChild as HTMLElement | null;

    if (!content) {
      console.warn("[Lenis] Wrapper has no content. Skipping.");
      return null;
    }

    const lenis = new Lenis({
      wrapper: wrapperEl,
      content,
      smooth: true,
    } as any);

    return lenis;
  };

  const raf = (time: number) => {
    if (!isRunning) return;
    instances.forEach((instance) => instance.raf(time));
    requestAnimationFrame(raf);
  };

  onMounted(() => {
    refs.forEach((r) => {
      if (r.value) {
        const instance = createLenis(r.value);
        if (instance) instances.push(instance);
      }
    });

    if (instances.length > 0) {
      requestAnimationFrame(raf);
    }
  });

  onUnmounted(() => {
    isRunning = false;
    instances.forEach((i) => i.destroy());
    instances.length = 0;
  });

  return {
    getInstances: () => instances,
  };
}

export function useLenis() {
  let lenis: Lenis | null = null;
  let frameId: number | null = null;

  const addLenis = () => {
    lenis = new Lenis({
      smooth: true,
    } as any);

    const raf = (time: number) => {
      lenis?.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);
  };

  const removeLenis = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    lenis?.destroy();
    lenis = null;
  };

  onMounted(addLenis);
  onUnmounted(removeLenis);

  return {
    getInstance: () => lenis,
  };
}
