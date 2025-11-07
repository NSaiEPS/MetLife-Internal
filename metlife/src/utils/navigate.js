let routerInstance;

export const setRouter = (router) => {
  routerInstance = router;
};

export const navigateTo = (path, options, message) => {
  //   if (
  //     path == "/login" &&
  //     message === "You are not authorised to use this api"
  //   ) {
  //     clearLocalStorage();
  //   }
  if (routerInstance) {
    routerInstance.navigate(path, options);
  } else {
    console.warn("Router not set yet");
  }
};
