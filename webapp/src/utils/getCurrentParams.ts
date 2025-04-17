export const getCurrentParams = (searchParams: URLSearchParams, exclusionParams: string[]) => {
  let currentParams = '?';
  searchParams.forEach((value, key) => {
    if (!exclusionParams.includes(key)) {
      currentParams += `${key}=${value}&`;
    }
  });
  return currentParams;
};
