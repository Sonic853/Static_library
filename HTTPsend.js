/**
   *
   * @param {string} url
   * @param {string} method
   * @param {Object.<string, any>} headers
   * @param {string} responseType
   * @param {string|undefined} data
   * @param {*} successHandler
   * @param {*} errorHandler
   * @returns
   */
let HTTPsend = function (url, method, headers, responseType, data = undefined, successHandler, errorHandler) {
  DEV_Log ?? console.log(`[${NAME}][${D()}]: `, url)
  if (typeof GM_xmlhttpRequest != 'undefined') {
    return new Promise((rl, rj) => {
      try {
        GM_xmlhttpRequest({
          method,
          url,
          headers,
          responseType,
          data,
          onerror: function (response) {
            DEV_Log ?? console.log(`[${NAME}][${D()}]: `, response.status)
            errorHandler && errorHandler(response.status)
            rj(response.status)
          },
          onload: function (response) {
            let status
            if (response.readyState == 4) { // `DONE`
              status = response.status
              if (status == 200) {
                DEV_Log ?? console.log(`[${NAME}][${D()}]: `, response.response)
                successHandler && successHandler(response.response)
                rl(response.response)
              } else {
                DEV_Log ?? console.log(`[${NAME}][${D()}]: `, status)
                errorHandler && errorHandler(status)
                rj(status)
              }
            }
          },
        })
      } catch (error) {
        rj(error)
      }
    })
  } else {
    return new Promise((rl, rj) => {
      try {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        xhr.withCredentials = true
        xhr.responseType = responseType
        xhr.onreadystatechange = function () {
          let status
          if (xhr.readyState == 4) { // `DONE`
            status = xhr.status
            if (status == 200) {
              console.log(`[${NAME}][${D()}]: `, xhr.response)
              successHandler && successHandler(xhr.response)
              rl(xhr.response)
            } else {
              console.log(`[${NAME}][${D()}]: `, status)
              errorHandler && errorHandler(status)
              rj(status)
            }
          }
        }
        xhr.send()
      } catch (error) {
        rj(error)
      }
    })
  }
}
class HSRequest {
  /**
   * Default: "GM"
   * @type {"GM"|"XHR"|"FETCH"|undefined}
   */
  mode = 'GM'
  /**
   * ["GM"|"XHR"|"FETCH"] Required. The URL to make the request to. Must be an absolute URL, beginning with the scheme. May be relative to the current page.
   * @type {string}
   */
  url = ''
  /**
   * ["GM"|"XHR"|"FETCH"] Required. Type of HTTP request to make (E.G. "GET", "POST")
   * @type {"GET"|"POST"|"PUT"|"DELETE"|"HEAD"|"OPTIONS"|"PATCH"}
   */
  method = 'GET'
  /**
   * ["GM"|"XHR"|"FETCH"] Optional. A set of headers to include in the request.
   * XHR and FETCH modes may not work.
   * @type {{
   * [key: string]: any
   * }}
   */
  headers = {}
  /**
   * ["GM"|"XHR"] Optional. Decode the response as specified type. Accepted values are "", "arraybuffer", "blob", "document", "json", "text", "ms-stream". Default value is "text". See XMLHttpRequest responseType.
   * @type {XMLHttpRequestResponseType}
   */
  responseType
  /**
   * ["GM"|"XHR"] Optional. Data to send in the request body. Usually for POST method requests.
   * like "username=johndoe&password=xyz123"
   * @type {string|undefined}
   */
  data
  /**
   * ["XHR"] Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
   * @type {Document | XMLHttpRequestBodyInit | null}
   */
  body
  /**
   * ["GM"] Optional, default false. When true, the data is sent as a Blob.
   * @type {boolean}
   */
  binary
  /**
   * ["GM"] (Compatibility: 1.10+) Optional, any object. This object will also be the context property of the #Response Object.
   * The same object passed into the original request.
   * @type {{
   * [key: string]: any
   * }}
   */
  context
  /**
   * ["GM"|"XHR"] Optional. A MIME type to specify with the request (E.G. "text/html; charset=ISO-8859-1").
   * @type {string}
   */
  overrideMimeType
  /**
   * ["GM"] Optional. User name to use for authentication purposes.
   * @type {string}
   */
  user
  /**
   * ["GM"] Optional. Password to use for authentication purposes.
   * @type {string}
   */
  password
  /**
   * ["GM"|"XHR"] Defaults to false. When true, this is a synchronous request. Be careful: The entire Firefox UI will be locked and frozen until the request completes. In this mode, more data will be available in the return value.
   * @type {boolean}
   * @deprecated
   */
  synchronous
  /**
   * ["GM"|"XHR"] The number of milliseconds to wait before terminating the call; zero (the default) means wait forever.
   * @type {number}
   */
  timeout
  /**
   * ["GM"] Optional. Object containing optional function callbacks (onabort, onerror, onload, onprogress) to monitor the upload of data. Each is passed one argument, the #Response Object.
  * @type {{
   *  onabort?: Function | undefined;
   *  onerror?: Function | undefined;
   *  onload?: Function | undefined;
   *  onprogress?: Function | undefined;
   * }}
   */
  upload
  /**
   * ["XHR"|"FETCH"] A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.
   * @type {RequestCredentials}
   */
  credentials
  /**
   * ["FETCH"] RequestInit
   * @type {RequestInit}
   */
  requestInit
  /**
   * ["XHR"|"FETCH"] True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
   * @type {boolean}
   */
  withCredentials
  /**
   * Debug mode. Defaults to false.
   * @type {boolean}
   */
  debug = false
  /**
   * Optional. Will be called when the request is aborted. Passed one argument, the #Response Object.
   * @type {Function}
   */
  onabort
  /**
   * Optional. Will be called if an error occurs while processing the request. Passed one argument, the #Response Object.
   * @type {Function}
   */
  onerror
  /**
   * Optional. Will be called when the request has completed successfully. Passed one argument, the #Response Object.
   * @type {Function}
   */
  onload
  /**
   * Optional. Will be called when the request progress changes. Passed one argument, the #Response Object.
   * @type {Function}
   */
  onprogress
  /**
   * Optional. Will be called repeatedly while the request is in progress. Passed one argument, the #Response Object.
   * @type {Function}
   */
  onreadystatechange
  /**
   * Optional. Will be called if/when the request times out. Passed one argument, the #Response Object.
   * @type {Function}
   */
  ontimeout
  /**
   * @param {Function} handler
   */
  set successHandler(handler) {
    this.onload = handler
  }
  get successHandler() {
    return this.onload
  }
  /**
   * @param {Function} handler
   */
  set errorHandler(handler) {
    this.onerror = handler
  }
  get errorHandler() {
    return this.onerror
  }
  /**
   * 
   * @param {{
   * mode?: "GM"|"XHR"|"FETCH"|undefined
   * url?: string
   * method?: "GET"|"POST"|"PUT"|"DELETE"|"HEAD"|"OPTIONS"|"PATCH"
   * headers?: {
   *  [key: string]: any
   * }
   * responseType?: XMLHttpRequestResponseType
   * data?: string|undefined
   * body?: Document | XMLHttpRequestBodyInit | null
   * binary?: boolean
   * context?: {
   *  [key: string]: any
   * }
   * overrideMimeType?: string
   * user?: string
   * password?: string
   * synchronous?: boolean
   * timeout?: number
   * upload?: {
   *  onabort?: Function | undefined;
   *  onerror?: Function | undefined;
   *  onload?: Function | undefined;
   *  onprogress?: Function | undefined;
   * }
   * credentials?: RequestCredentials
   * requestInit?: RequestInit
   * withCredentials?: boolean
   * debug?: boolean
   * onabort?: Function
   * onerror?: Function
   * onload?: Function
   * onprogress?: Function
   * onreadystatechange?: Function
   * ontimeout?: Function
   * }} [options] 
   */
  constructor({
    mode,
    url,
    method,
    headers,
    responseType,
    data,
    body,
    binary,
    context,
    overrideMimeType,
    user,
    password,
    synchronous,
    timeout,
    upload,
    credentials,
    requestInit,
    withCredentials,
    debug,
    onabort,
    onerror,
    onload,
    onprogress,
    onreadystatechange,
    ontimeout
  } = {}) {
    this.mode = mode
    this.url = url
    this.method = method
    this.headers = headers
    this.responseType = responseType
    this.data = data
    this.body = body
    this.binary = binary
    this.context = context
    this.overrideMimeType = overrideMimeType
    this.user = user
    this.password = password
    this.synchronous = synchronous
    this.timeout = timeout
    this.upload = upload
    this.debug = debug
    this.onabort = onabort
    this.onerror = onerror
    this.onload = onload
    this.credentials = credentials
    this.requestInit = requestInit
    this.withCredentials = withCredentials
    this.onprogress = onprogress
    this.onreadystatechange = onreadystatechange
    this.ontimeout = ontimeout
  }
}
/**
 * 
 * @param {HSRequest} hsRequest 
 * @param {boolean} stringOnly
 * @returns {Promise<string>|Promise<XMLHttpRequest>|Promise<Response>|Promise<Tampermonkey.Request>}
 */
let HTTPSendPro = (hsRequest, stringOnly = false) => {
  if (hsRequest.mode.toUpperCase() === 'GM' && typeof GM_xmlhttpRequest === 'undefined') {
    console.log('HTTPSendPro: GM_xmlhttpRequest not found, using XHR')
    hsRequest.mode = 'XHR'
  }
  hsRequest.method = hsRequest.method ?? 'GET'
  return new Promise((rl, rj) => {
    switch (hsRequest.mode.toUpperCase()) {
      default:
      case 'GM':
        {
          if (hsRequest.debug) console.log(`HTTPSendPro: GM mode - ${hsRequest.method} ${hsRequest.url}`)
          try {
            /**
             * @type {{
             * [key: string]: any
             * }}
             */
            const hsr = {
              method: hsRequest.method,
              url: hsRequest.url,
            }
            if (hsRequest.binary !== undefined) {
              hsr.binary = hsRequest.binary
            }
            if (hsRequest.context !== undefined) {
              hsr.context = hsRequest.context
            }
            if (hsRequest.data !== undefined) {
              hsr.data = hsRequest.data
            }
            if (hsRequest.headers !== undefined) {
              hsr.headers = hsRequest.headers
            }
            if (hsRequest.overrideMimeType !== undefined) {
              hsr.overrideMimeType = hsRequest.overrideMimeType
            }
            if (hsRequest.user !== undefined) {
              hsr.user = hsRequest.user
            }
            if (hsRequest.password !== undefined) {
              hsr.password = hsRequest.password
            }
            if (hsRequest.responseType !== undefined) {
              hsr.responseType = hsRequest.responseType
            }
            if (hsRequest.synchronous !== undefined) {
              hsr.synchronous = hsRequest.synchronous
            }
            if (hsRequest.timeout !== undefined) {
              hsr.timeout = hsRequest.timeout
            }
            if (hsRequest.upload !== undefined) {
              hsr.upload = hsRequest.upload
            }
            hsr.onabort = (response) => {
              if (hsRequest.onabort) hsRequest.onabort(response)
              rj(response)
            }
            hsr.onerror = (response) => {
              if (hsRequest.onerror) hsRequest.onerror(response)
              rj(response)
            }
            hsr.onload = (response) => {
              /**
               * @type {number}
               */
              let status
              if (response.readyState == 4) { // `DONE`
                status = response.status
                if (status == 200) {
                  if (hsRequest.onload) {
                    hsRequest.onload(stringOnly ? response.response : response)
                  }
                  rl(stringOnly ? response.response : response)
                } else {
                  if (hsRequest.onerror) hsRequest.onerror(response)
                  rj(response)
                }
              }
            }
            hsr.onprogress = (response) => {
              if (hsRequest.onprogress) hsRequest.onprogress(response)
            }
            hsr.onreadystatechange = (response) => {
              if (hsRequest.onreadystatechange) hsRequest.onreadystatechange(response)
            }
            hsr.ontimeout = (response) => {
              if (hsRequest.ontimeout) hsRequest.ontimeout(response)
              rj(response)
            }
            GM_xmlhttpRequest(hsr)
          } catch (error) {
            rj(error)
          }
        }
        break;
      case 'XHR':
        {
          if (hsRequest.debug) console.log(`HTTPSendPro: XHR mode - ${hsRequest.method} ${hsRequest.url}`)
          try {
            const xhr = new XMLHttpRequest()
            const _async = hsRequest.synchronous === undefined ? true : !hsRequest.synchronous
            if (hsRequest.user !== undefined
              || hsRequest.password !== undefined) {
              xhr.open(hsRequest.method, hsRequest.url, _async, hsRequest.user, hsRequest.password)
            }
            else {
              xhr.open(hsRequest.method, hsRequest.url, _async)
            }
            if (hsRequest.withCredentials !== undefined) {
              xhr.withCredentials = hsRequest.withCredentials
            }
            else if (hsRequest.credentials !== undefined) {
              switch (hsRequest.credentials) {
                case 'omit':
                case 'same-origin':
                  xhr.withCredentials = false
                  break;
                case 'include':
                  xhr.withCredentials = true
                  break;
              }
            }
            if (hsRequest.responseType !== undefined) {
              xhr.responseType = hsRequest.responseType
            }
            if (hsRequest.timeout !== undefined) {
              xhr.timeout = hsRequest.timeout
            }
            if (hsRequest.overrideMimeType !== undefined) {
              xhr.overrideMimeType(hsRequest.overrideMimeType)
            }
            if (hsRequest.headers !== undefined) {
              for (const key in hsRequest.headers) {
                xhr.setRequestHeader(key, hsRequest.headers[key])
              }
            }
            xhr.onabort = (event) => {
              if (hsRequest.onabort) hsRequest.onabort(xhr, event)
              rj(event)
            }
            let errored = false
            xhr.onerror = (event) => {
              if (!errored) {
                errored = true
                if (hsRequest.onerror) {
                  hsRequest.onerror(xhr, event)
                }
                rj(xhr, event)
              }
            }
            let loaded = false
            xhr.onload = (event) => {
              if (!loaded) {
                loaded = true
                if (hsRequest.onload) {
                  if (stringOnly) {
                    hsRequest.onload(xhr.response)
                  }
                  else {
                    hsRequest.onload(xhr, event)
                  }
                }
                if (stringOnly) {
                  rl(xhr.response)
                }
                else {
                  rl(xhr)
                }
              }
            }
            xhr.onprogress = (event) => {
              if (hsRequest.onprogress) hsRequest.onprogress(xhr, event)
            }
            xhr.onreadystatechange = (event) => {
              if (hsRequest.onreadystatechange) hsRequest.onreadystatechange(xhr, event)
              else {
                if (xhr.readyState == 4) { // `DONE`
                  if (xhr.status == 200) {
                    if (!loaded) {
                      loaded = true
                      if (hsRequest.onload) {
                        if (stringOnly) {
                          hsRequest.onload(xhr.response)
                        }
                        else {
                          hsRequest.onload(xhr, event)
                        }
                      }
                      if (stringOnly) {
                        rl(xhr.response)
                      }
                      else {
                        rl(xhr)
                      }
                    }
                  } else {
                    if (!errored) {
                      errored = true
                      if (hsRequest.onerror) hsRequest.onerror(xhr, event)
                      rj(xhr)
                    }
                  }
                }
              }
            }
            xhr.ontimeout = (event) => {
              if (hsRequest.ontimeout) hsRequest.ontimeout(event)
              rj(event)
            }
            if (hsRequest.data !== undefined) {
              xhr.send(hsRequest.data)
            }
            else if (hsRequest.body !== undefined) {
              xhr.send(hsRequest.body)
            }
            else {
              xhr.send()
            }
          } catch (error) {
            rj(error)
          }
        }
        break;
      case 'FETCH':
        {
          if (hsRequest.debug) console.log(`HTTPSendPro: FETCH mode - ${hsRequest.method} ${hsRequest.url}`)
          try {
            let url = new URL(hsRequest.url)
            if (hsRequest.user !== undefined) {
              url.username = hsRequest.user
            }
            if (hsRequest.password !== undefined) {
              url.password = hsRequest.password
            }
            /**
             * @type {RequestInit}
             */
            const _init = hsRequest.requestInit || {
              method: hsRequest.method,
            }
            if (hsRequest.headers !== undefined) {
              _init.headers = hsRequest.headers
            }
            if (hsRequest.credentials !== undefined) {
              _init.credentials = hsRequest.credentials
            }
            else if (hsRequest.withCredentials !== undefined) {
              _init.credentials = hsRequest.withCredentials ? 'include' : 'omit'
            }
            fetch(url, _init).then((response) => {
              if (hsRequest.onload) {
                if (stringOnly) {
                  response.text().then((text) => {
                    hsRequest.onload(text)
                  })
                }
                else {
                  hsRequest.onload(response)
                }
              }
              if (stringOnly) {
                response.text().then((text) => {
                  rl(text)
                })
              }
              else {
                rl(response)
              }
            }).catch((error) => {
              if (hsRequest.onerror) hsRequest.onerror(error)
              rj(error)
            })
          } catch (error) {
            rj(error)
          }
        }
        break;
    }
  })
}
// Test
HTTPSendPro({
  mode: 'GM',
  method: 'GET',
  url: 'https://www.baidu.com',
}, true).then((response) => {
  console.log(response)
})