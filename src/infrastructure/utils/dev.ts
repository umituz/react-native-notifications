export const isDev = () => {
  try {
    return typeof __DEV__ !== 'undefined' && __DEV__;
  } catch {
    return false;
  }
};

export const devLog = (message: string, ...args: any[]) => {
  if (isDev()) {
    console.log(message, ...args);
  }
};

export const devError = (message: string, ...args: any[]) => {
  if (isDev()) {
    console.error(message, ...args);
  }
};

export const devWarn = (message: string, ...args: any[]) => {
  if (isDev()) {
    console.warn(message, ...args);
  }
};