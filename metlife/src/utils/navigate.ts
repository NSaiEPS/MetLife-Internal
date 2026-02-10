import type { NavigateOptions } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";

let routerInstance: { navigate: NavigateFunction } | null = null;

export const setRouter = (router: { navigate: NavigateFunction }) => {
  routerInstance = router;
};

export const navigateTo = (
  path: string,
  options?: NavigateOptions,
  message?: string
) => {
  if (routerInstance) {
    routerInstance.navigate(path, options);
  } else {
    console.warn("Router not set yet");
  }
};
