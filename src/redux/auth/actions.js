import { enqueueSnackbar } from '../snackbars/actions'
import req from '../../utils/req'
import Cookies from 'js-cookie'

export function login(data) {

  data.email = data.username
  let auth = {}

  return (dispatch, getState) => {
    const { locale } = getState().locales
    req('http://35.181.48.142/api/login_check', {
      method: 'post', body: data
    })
    .then(res => {
      auth.token = res.token
      Cookies.set('jwt', auth.token)
      dispatch(getCurrentUser())
      dispatch(enqueueSnackbar(locale.alerts.LOGIN_SUCCESS, 'success'))
    })
  }
}

export function logout() {
  Cookies.remove('jwt')
  return {
    type: 'LOGOUT'
  }
}

export function getCurrentUser() {
  return (dispatch) => {
    if (Cookies.get('jwt')) {
      req('http://35.181.48.142/api/users/me', {token: true})
      .then(res => {
        dispatch(setCurrentUser(res))
      })
    } else {
      dispatch(setCurrentUser())
    }
  }

  function setCurrentUser(user) {
    return {
      type: 'SET_CURRENT_USER',
      user: user,
      logged: user ? true : false,
    }
  }
}
