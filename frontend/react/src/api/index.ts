export const url = (endpoint: string) => {
  return import.meta.env.VITE_APP_API_ROUTE + endpoint;
};
