import siteConfig from '../../config/site.config';
import { omitBy, isNull, isUndefined } from 'lodash';
import { getToken, getLanguage, getCountry } from '../helpers/utility';

const defaultHeader = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

function apiCall(
  url,
  data = {},
  methodParm = 'GET',
  heads = defaultHeader,
  formData = false,
  fetchCommonData = false,
) {
  const headers = { ...heads };
  const method = methodParm.toUpperCase();
  const token = getToken();
  const lang = getLanguage();
  const country = getCountry();
  const cId = country && country.id ? country.id : '';

  if (token && !headers.Authorization)
    headers.Authorization = `Bearer ${token}`;

  headers.language = lang || 'en';

  let options = {
    method,
    headers,
  };
  let query = '';
  let qs = '';

  const apiData = !formData
    ? omitBy(data, (v) => isUndefined(v) || isNull(v))
    : data;

  if (cId && cId !== 'all') {
    // apiData.country = cId;
    headers.country = cId || '';
  }

  const dataLength = apiData ? Object.keys(apiData).length : 0;
  const body = formData ? apiData : JSON.stringify(apiData);

  if (method === 'POST' || method === 'PUT' || method === 'DELETE')
    options = { ...options, body };
  if (method === 'GET' && dataLength > 0) {
    Object.keys(apiData).map((key, i) => {
      const sep = i === dataLength - 1 ? '' : '&';
      query += `${encodeURIComponent(key)}=${encodeURIComponent(
        apiData[key],
      )}${sep}`;
    });
    qs = `?${query}`;
  }

  return new Promise((resolve, reject) => {
    fetch(`${siteConfig.apiUrl}${url}${qs}`, options)
      .then((response) => response.blob())
      .then((blob) => {
        const url1 = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url1;
        a.download = `invoice_${data.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export default apiCall;
