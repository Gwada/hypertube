import store from '../redux/store'
import { enqueueSnackbar } from '../redux/snackbars/actions'
import Cookies from 'js-cookie'

const req = (url, options) => {
  let params = {}
  // options
  if (options) {
    console.log('body', options.body)
    // method
    if (options.method) params.method = options.method
    // content type
    if (options.contentType) params.headers = {'Content-Type': options.contentType}
    else if (options.body) params.headers = {'Content-Type': 'application/json'}
    // body
    if (options.body)
      params.body = params.headers['Content-Type'] === 'application/json' ? JSON.stringify(options.body) : options.body
    // token
    if (options.token)
      params.headers = {...params.headers, Authorization: 'Bearer ' + Cookies.get('jwt')}
  }
  return new Promise((resolve, reject) => {
    console.log('params', params)
    fetch(url, params)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          resolve(json)
        })
      } else {
        response.json().then(json => console.error(json))
        if (response.status >= 500)
          store.dispatch(enqueueSnackbar(response.statusText, 'error'))
        reject(response)
      }
    })
    .catch(err => {
      store.dispatch(enqueueSnackbar(err.message, 'error'))
      console.error(err)
      reject(err)
    })
  })
}

export default req
