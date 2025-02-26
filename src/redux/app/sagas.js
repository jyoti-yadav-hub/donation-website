import { all, takeEvery, put, fork } from 'redux-saga/effects';
// import { isObject, isEmpty, isArray } from 'lodash';
// import getApiData from '@iso/lib/helpers/apiHelper';
// import { getCountry } from '@iso/lib/helpers/utility';
import actions from './actions';

export function* setCountry() {
  yield takeEvery(actions.SET_CURRENT_COUNTRY, function* (payload) {
    const { country } = payload;
    try {
      yield localStorage.setItem(
        'country',
        country ? JSON.stringify(country) : '',
      );
      yield put({
        type: actions.SET_COUNTRY,
        country,
      });
    } catch (e) {
      // console.log(e);
    }
  });
}

// export function* fetchCommonData() {
//   yield put({
//     type: actions.SET_GENERAL_DATA,
//     loading: true,
//   });
//   // const country = getCountry();
//   // const cId = country && country.id ? country.id : '';
//   try {
//     const data = {
//       allData: 1,
//     };
//     const res = yield getApiData('country/list', data);
//     if (res.success && isObject(res.data) && !isEmpty(res.data)) {
//       yield put({
//         type: actions.SET_GENERAL_DATA,
//         data: res.data,
//       });

//       // Set default country Netherland
//       // const countries = isArray(res.data.countries) ? res.data.countries : [];
//       // if (!isEmpty(countries) && !cId) {
//       //   const dfCountry = countries.find((ct) => ct.name === 'Netherlands');
//       //   if (dfCountry) {
//       //     yield put({
//       //       type: actions.SET_CURRENT_COUNTRY,
//       //       country: dfCountry,
//       //     });
//       //   }
//       // }
//     } else {
//       yield put({
//         type: actions.SET_GENERAL_DATA,
//         loading: false,
//       });
//     }
//   } catch (e) {
//     // console.log(e);
//     yield put({
//       type: actions.SET_GENERAL_DATA,
//       loading: false,
//     });
//   }
// }

export default function* rootSaga() {
  yield all([
    // takeEvery(actions.FETCH_COMMON_DATA, fetchCommonData),
    fork(setCountry),
  ]);
}
