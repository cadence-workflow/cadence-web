const decodeUrlParams = (params: { [k: string]: string }) => {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      decodeURIComponent(value),
    ])
  );
};

export default decodeUrlParams;
