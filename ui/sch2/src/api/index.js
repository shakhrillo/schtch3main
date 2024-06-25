import axios from 'axios';

export const url = 'http://192.168.100.23:8200/';

export const create = async (data) => {
  return await axios.post(url + 'api/items/', data).then((res) => {
    console.log(res)
    return res;
  });
};

export const fetchGet = async (page = 1) => {
  return await axios.get(url + `api/items/?page=${page}`);
};
export const fetchGetMa = async () => {
  return await axios.get(url + `api/items/ma`);
};
export const updated = async (id, notes) => {
  return await axios.patch(url + `api/items/${id}`, notes);
};
export const fetchSearch = async (fromDate, toDate, toArticle, status, ma, machine) => {
  return axios.get(`${url}api/items`, {
    params: {
      fromDate: fromDate,
      toDate: toDate,
      status: status,
      ma: ma,
      machine: machine,
      toArticle: toArticle,
    },
  })
  // return await axios.get(
  //   url +
  //     `api/items/?${fromDate ? 'from_date=' + fromDate : '&'}&${
  //       toDate ? 'to_date=' + toDate : '&'
  //     }&${status ? 'status=' + status : '&'}&${ma ? 'ma=' + ma : '&'}&${
  //       machine ? 'machine=' + machine : '&'
  //     }`
  // );
};
export const fetchSort = async (page = 1, sortBy, sortOrder) => {
  return await axios.get(
    url + `api/items/?page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
};
