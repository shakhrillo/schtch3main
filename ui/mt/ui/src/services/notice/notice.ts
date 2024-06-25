import api from '../../utils/fetchApi';

// post function on the notice service
export const postNotice = async (data: any) => {
  const response = await api.post('/notice/', data);
  return response.data;
};
