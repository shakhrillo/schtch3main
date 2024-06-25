export * from './clearInputs';
export * from './fetchApi';

export const getBaseUrl = () => {
  return console.log(import.meta.env.VITE_REACT_APP_BASE_URL);
};
