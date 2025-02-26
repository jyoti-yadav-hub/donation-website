/* eslint-disable no-return-await */
// import jwtDecode from 'jwt-decode';
import SuperFetch from './superFetch';

class AuthHelper {
  login = async (userInfo, type) => {
    if (!userInfo.email || !userInfo.password) {
      return { error: 'please fill in the input' };
    }
    const apiUrl = 'admin/login';
    return await SuperFetch.post(apiUrl, userInfo).then((response) => {
      return response;
    });
  };
}
export default new AuthHelper();
