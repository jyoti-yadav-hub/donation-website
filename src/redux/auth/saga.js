/* eslint-disable func-names */
import { all, takeEvery, put, fork } from 'redux-saga/effects';
import { isObject, isString } from 'lodash';
import { getToken, clearToken, getUserData } from '../../shared/helpers/utility';
import actions from './actions';

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function* ({ payload }) {
    const { token, user } = payload;
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        user,
        profile: 'Profile',
      });
    } else {
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function* (payload) {
    const user = isObject(payload.user)
      ? JSON.stringify(payload.user)
      : payload.user;
    const userLocal = user || '';
    const token = isString(payload.token) ? payload.token : '';
    yield localStorage.setItem('id_token', token);
    yield localStorage.setItem('user_data', userLocal);
  });
}

export function* setUser() {
  yield takeEvery('SET_USER', function* (payload) {
    const user = isObject(payload.user)
      ? JSON.stringify(payload.user)
      : payload.user;
    const userLocal = user || '';
    // const token = payload.token || '';
    localStorage.setItem('user_data', userLocal);
    yield put({
      type: actions.SET_USER_OBJ,
      user: payload.user,
      // token,
    });
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function* () {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT_SAGA, function* () {
    yield clearToken();
    yield put({
      type: actions.LOGOUT,
    });
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function* () {
    const token = getToken();
    const user = getUserData();
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        user,
        profile: 'Profile',
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(setUser),
  ]);
}
