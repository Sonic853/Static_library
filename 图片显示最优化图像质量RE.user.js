// ==UserScript==
// @name       Resize Image On "Open image in new tab" Re
// @name:zh-CN 图片显示最优化图像质量RE
// @version    0.1.2
// @description  Support: Google(blogspot YouTube)\Tumblr\Twitter\Steam(Only user content)\ArtStation\Pinimg\Weibo\Reddit (And more...
// @description:zh-CN 支持：谷歌(blogspot YouTube)、Tumblr、推特、Steam、新浪微博、知乎、豆瓣、百度贴吧、淘宝（天猫）、ArtStation、Pinimg、Reddit 等
// @run-at     document-start
// @grant      GM_xmlhttpRequest
// @grant      GM_download
// @match      http://*.googleusercontent.com/*
// @match      https://*.googleusercontent.com/*
// @match      http://*.media.tumblr.com/*
// @match      https://*.media.tumblr.com/*
// @match      http://secure.static.tumblr.com/*
// @match      https://secure.static.tumblr.com/*
// @match      http://*.bp.blogspot.com/*
// @match      https://*.bp.blogspot.com/*
// @match      http://*.sinaimg.cn/*
// @match      https://*.sinaimg.cn/*
// @match      http://*.sinaimg.com/*
// @match      https://*.sinaimg.com/*
// @match      http://*.twimg.com/*
// @match      https://*.twimg.com/*
// @match      http://*.zhimg.com/*
// @match      https://*.zhimg.com/*
// @match      http://*.douban.com/view/*
// @match      https://*.douban.com/view/*
// @match      http://*.doubanio.com/view/*
// @match      https://*.doubanio.com/view/*
// @exclude    https://*.douban.com/view/ark_article_cover/*
// @exclude    https://*.doubanio.com/view/ark_article_cover/*
// @match      http://imgsrc.baidu.com/*
// @match      https://imgsrc.baidu.com/*
// @match      http://imgsa.baidu.com/*
// @match      https://imgsa.baidu.com/*
// @match      http://*.hiphotos.baidu.com/*
// @match      https://*.hiphotos.baidu.com/*
// @match      http://*.bdimg.com/*
// @match      https://*.bdimg.com/*
// @match      http://tiebapic.baidu.com/*
// @match      https://tiebapic.baidu.com/*
// @match      http://images.akamai.steamusercontent.com/*
// @match      https://images.akamai.steamusercontent.com/*
// @match      http://steamuserimages-a.akamaihd.net/*
// @match      https://steamuserimages-a.akamaihd.net/*
// @match      http://*.artstation.com/*
// @match      https://*.artstation.com/*
// @match      http://i.ytimg.com/*
// @match      https://i.ytimg.com/*
// @match      http://*.ggpht.com/*
// @match      https://*.ggpht.com/*
// @match      http://*.pinimg.com/*
// @match      https://*.pinimg.com/*
// @match      http://*.hdslb.com/*
// @match      https://*.hdslb.com/*
// @match      http://*.alicdn.com/*
// @match      https://*.alicdn.com/*
// @match      http://*.360buyimg.com/*
// @match      https://*.360buyimg.com/*
// @match      http://*.riotpixels.net/*
// @match      https://*.riotpixels.net/*
// @match      https://preview.redd.it/*
// @match      https://*.akamaized.net/imagecache/*
// @match      https://mmbiz.qpic.cn/*
// @match      https://image.gcores.com/*
// @match      https://bkimg.cdn.bcebos.com/*
// @match      https://*/wp-content/uploads/*/*
// @match      http://*/wp-content/uploads/*/*
// @match      https://*.126.net
// @copyright  https://blog.853lab.com/
// @license    MIT
// @namespace  http://853lab.com/
// @original-author clso
// @original-license MIT
// @original-script https://greasyfork.org/scripts/2312
// ==/UserScript==

(async function () {
  const NAME = "Resize Image"
  const D = () => {
    return new Date().toLocaleTimeString()
  }
  if (typeof GM_xmlhttpRequest === 'undefined') {
    console.error(`[${NAME}][${D()}]: `, "GM is no Ready.")
  } else {
    console.log(`[${NAME}][${D()}]: `, "GM is Ready.")
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
    hsRequest.mode = hsRequest.mode ?? 'GM'
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
                if (response.status == 200) {
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
                }
                else {
                  if (hsRequest.onerror) hsRequest.onerror(response)
                  rj(response)
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

  const url = document.location.toString()
  /**
   * @type {RegExpExecArray | null}
   */
  let m = null

  /**
   * 
   * @param {string} qs 
   * @returns 
   */
  function getQueryParams(qs) {
    //by http://stackoverflow.com/a/1099670
    qs = qs.split('+').join(' ')

    /**
     * @type {Object.<string, string>}
     */
    let params = {}
    /**
     * @type {RegExpExecArray | null}
     */
    let tokens
    let re = /[?&]?([^=]+)=([^&]*)/g
    while ((tokens = re.exec(qs))) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
    }
    return params
  }
  /**
   * 
   * @param {string} url 
   * @returns 
   */
  async function FuckDB(url) {
    /**
     * @type {XMLHttpRequest}
     */
    let response = await HTTPSendPro({
      mode: "XHR",
      url,
      method: "HEAD",
      synchronous: true,
    })
    if (response.status == 200) {
      let imgfsize = Number(response.getResponseHeader("Content-Length"))
      if (imgfsize > 0) {
        document.location = url
        return true
      }
    }
    return false
  }

  class CFG {
    /**
     * 名称
     * @type {string}
     */
    name = ""
    /**
     * 匹配规则
     * @type {RegExp | null}
     */
    match = null
    /**
     * 执行方法
     * @param {RegExpExecArray | null} m 
     */
    run(m) {
      return
    }
    /**
     * 
     * @param {string} name 
     * @param {RegExp} match 
     * @param {(m: RegExpExecArray | null) => void} run
     */
    constructor(name, match, run) {
      this.name = name
      this.match = match
      this.run = run
    }
  }

  let cfgs = [
    new CFG("google", /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i, m => {
      if (m[2] != "s0") {
        document.location = `${m[1]}s0${m[3]}`
      }
    }),
    new CFG("google", /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+=)(.+)(?:\?.+)?$/i, m => {
      if (m[2] != "s0") {
        document.location = `${m[1]}s0`
      }
    }),
    new CFG("google", /^(https?:\/\/\w+\.ggpht\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i, m => {
      if (m[2] != "s0") {
        document.location = `${m[1]}s0${m[3]}`
      }
    }),
    new CFG("blogspot", /^(https?:\/\/\w+\.bp\.blogspot\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i, m => {
      if (m[2] != "s0") {
        document.location = `${m[1]}s0${m[3]}`
      }
    }),
    new CFG("youtube", /^https?:\/\/i\.ytimg.com\/an_webp\/([^\/]+)\/\w+\.(jpg|jpeg|gif|png|bmp|webp)(\?.+)?$/i, m => {
      HTTPSendPro({
        mode: "XHR",
        url: `https://i.ytimg.com/vi/${m[1]}/maxresdefault.jpg`,
        method: "HEAD",
        onreadystatechange: function (xhr) {
          if (xhr.status == 200) {
            document.location = `https://i.ytimg.com/vi/${m[1]}/maxresdefault.jpg`
          } else if (xhr.status == 404) {
            document.location = `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
          }
        }
      })
    }),
    new CFG("youtube", /^(https?:\/\/i\.ytimg.com\/vi\/[^\/]+\/)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(\?.+)?$/i, m => {
      if (m[2] != "maxresdefault") {
        HTTPSendPro({
          mode: "XHR",
          url: `${m[1]}maxresdefault${m[3]}`,
          method: "HEAD",
          onreadystatechange: function (xhr) {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                document.location = `${m[1]}maxresdefault${m[3]}`
              } else if (xhr.status == 404) {
                if (m[5] || m[2] === "mqdefault")
                  document.location = `${m[1]}hqdefault${m[3]}`
              }
            }
          }
        })
      }
    }),
    new CFG("ggpht", /^(https?:\/\/\w+\.ggpht\.com\/.+)=(?:[s|w|h])(\d+)(.+)?$/i, m => {
      if (m[2] != "0") {
        document.location = m[1] + "=s0"
      }
    }),
    new CFG("tumblr", /^(https?:\/\/\d+\.media\.tumblr\.com\/.*tumblr_\w+_)(\d+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i, m => {
      if (m[2] < 1280) {
        HTTPSendPro({
          mode: "XHR",
          url: `${m[1]}1280${m[3]}`,
          method: "HEAD",
          onreadystatechange: function (xhr) {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                document.location = `${m[1]}1280${m[3]}`
              }
            }
          }
        })
      }
    }),
    new CFG("twitter", /^(https?:\/\/\w+\.twimg\.com\/media\/[^\/:]+)\.(jpg|jpeg|gif|png|bmp|webp)(:\w+)?$/i, m => {
      let format = m[2]
      if (m[2] == "jpeg") format = "jpg"
      document.location = `${m[1]}?format=${format}&name=orig`
    }),
    new CFG("twitter", /^(https?:\/\/\w+\.twimg\.com\/.+)(\?.+)$/i, m => {
      let pars = getQueryParams(document.location.search)
      if (!pars.format || !pars.name) return
      if (pars.name == "orig") return
      document.location = `${m[1]}?format=${pars.format}&name=orig`
    }),
    new CFG("Steam (Only user content)", /^(https?:\/\/(images\.akamai\.steamusercontent\.com|steamuserimages-a\.akamaihd\.net)\/[^\?]+)\?.+$/i, m => {
      document.location = m[1]
    }),
    new CFG("新浪微博", /^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i, m => {
      if (m[2] != "large") {
        document.location = `${m[1]}large${m[3]}`
      }
    }),
    new CFG("zhihu", /^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i, m => {
      if (m[3] != "r") {
        document.location = `${m[1]}${m[2]}r${m[4]}`
      }
    }),
    new CFG("douban NEED TEST", /^(https?:\/\/\w+\.douban(?:io)?\.com\/view\/.+\/)(\w+)(\/public\/.+\.)(jpg|jpeg|gif|png|bmp|webp)(?:\?.+)?$/i, async m => {
      if (m[2] != "r" && m[2] != "raw" && m[2] != "r_ratio_poster" && m[2] != "l") {
        if (await FuckDB(`${m[1]}r${m[3]}${m[4]}`)) { }
        else if (await FuckDB(`${m[1]}raw${m[3]}${m[4]}`)) { }
        else if (await FuckDB(`${m[1]}r_ratio_poster${m[3]}${m[4]}`)) { }
        else if (await FuckDB(`${m[1]}l${m[3]}${m[4]}`)) { }
        else if (m[4] == "webp") {
          m[4] = "jpg"
          if (await FuckDB(`${m[1]}r${m[3]}${m[4]}`)) { }
          else if (await FuckDB(`${m[1]}raw${m[3]}${m[4]}`)) { }
          else if (await FuckDB(`${m[1]}r_ratio_poster${m[3]}${m[4]}`)) { }
          else if (await FuckDB(`${m[1]}l${m[3]}${m[4]}`)) { }
        }
      }
    }),
    new CFG("artstation", /^(https?:\/\/cdn\w+\.artstation\.com\/.+\/)(\d{4,}\/)(\w+)(\/[^\/]+)$/i, m => {
      if (m[3] != "original") {
        HTTPSendPro({
          mode: "XHR",
          url: `${m[1]}original${m[3]}`,
          method: "HEAD",
          onreadystatechange: function (xhr) {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                document.location = `${m[1]}original${m[4]}`
              } else if (xhr.status == 404) {
                if (m[3] != "large") {
                  document.location = `${m[1]}large${m[4]}`
                }
              }
            }
          }
        })
      }
    }),
    new CFG("artstation", /^(https?:\/\/cdn\w+\.artstation\.com\/.+\/)(\w+)(\/[^\/]+)$/i, m => {
      if (m[2] != "original") {
        HTTPSendPro({
          mode: "XHR",
          url: `${m[1]}original${m[3]}`,
          method: "HEAD",
          onreadystatechange: function (xhr) {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                document.location = `${m[1]}original${m[3]}`
              } else if (xhr.status == 404) {
                if (m[3] != "large") {
                  document.location = `${m[1]}large${m[3]}`
                }
              }
            }
          }
        })
      }
    }),
    new CFG("pinimg", /^(https?:\/\/i\.pinimg\.com\/)(\w+)(\/.+)$/i, m => {
      if (m[2] != "originals") {
        document.location = `${m[1]}originals${m[3]}`
      }
    }),
    new CFG("pinimg", /^(https?:\/\/s-media[\w-]+\.pinimg\.com\/)(\w+)(\/.+)$/i, m => {
      if (m[2] != "originals") {
        document.location = `${m[1]}originals${m[3]}`
      }
    }),
    new CFG("bilibili", /^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i, m => {
      document.location = m[1]
    }),
    new CFG("taobao(tmall)", /^(https?:\/\/(?:.+?)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i, m => {
      document.location = m[1]
    }),
    new CFG("jd", /^(https?:\/\/(?:img\d+)\.360buyimg\.com\/)((?:.+?)\/(?:.+?))(\/(?:.+?))(\!.+)?$/i, m => {
      if (m[2] != "sku/jfs") {
        document.location = `${m[1]}sku/jfs${m[3]}`
      }
    }),
    new CFG("riotpixels", /^(https?:\/\/(?:.+?)\.riotpixels\.net\/.+\.(jpg|jpeg|gif|png|bmp|webp))\..+?$/i, m => {
      document.location = m[1]
    }),
    new CFG("reddit NEED TEST", /^https?:\/\/preview\.redd\.it\/(.+\.(jpg|jpeg|gif|png|bmp|webp))\?.+?$/i, m => {
      document.location = `https://i.redd.it/${m[1]}`
    }),
    new CFG("akamaized", /^(https:\/\/.+\.akamaized\.net\/imagecache\/\d+\/\d+\/\d+\/\d+\/)(\d+)(\/.+)$/i, m => {
      if (m[2] < 1920) document.location = `${m[1]}1920${m[3]}`
    }),
    new CFG("微信公众号 by sbdx", /^(https:\/\/mmbiz\.qpic\.cn\/mmbiz_jpg\/.+?\/)(\d+)(\?wx_fmt=jpeg)/i, m => {
      if (m[2] != 0) document.location = `${m[1]}0${m[3]}`
    }),
    new CFG("gcores", /^(https?:\/\/.+\.gcores\.com\/.+)\?.+$/i, m => {
      document.location = m[1]
    }),
    new CFG("baidu", /^https?:\/\/(?:imgsrc|imgsa|tiebapic|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/forum\/pic\/item\/.+/i, m => {
      if ((m = url.match(/^(https?):\/\/(?:imgsrc|imgsa|tiebapic|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i))
        && url.includes("?")) {
        document.location = `${m[1]}://imgsrc.baidu.com/forum/pic/item/${m[2]}`
      }
    }),
    new CFG("baidu baike", /^https?:\/\/(?:bkimg|hiphotos)\.cdn\.bcebos\.com\/pic\/(\w+)(\?.+)?$/i, m => {
      HTTPSendPro({
        mode: "XHR",
        url: `https://imgsrc.baidu.com/forum/pic/item/${m[1]}.png`,
        method: "GET",
        onreadystatechange: function (xhr) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              if ((xhr.response.length !== 0 && xhr.response.length !== 4144 && xhr.response.length !== 4145) || confirm("图片有可能不存在，是否跳转到原图？")) {
                document.location = `https://imgsrc.baidu.com/forum/pic/item/${m[1]}.png`
              }
            }
          }
        }
      })
    }),
    // https://*/wp-content/uploads/*/*
    // http://*/wp-content/uploads/*/*
    // 判断是否带有 - 并且后面是 数字x数字
    new CFG("wp-content", /^(https?:\/\/.+?\/wp-content\/uploads\/.+?)(-\d+x\d+)?(\.\w+)$/i, m => {
      if (m[2]) {
        document.location = m[1] + m[3]
      }
    }),
    new CFG("wp-content", /^(http?:\/\/.+?\/wp-content\/uploads\/.+?)(-\d+x\d+)?(\.\w+)$/i, m => {
      if (m[2]) {
        document.location = m[1] + m[3]
      }
    }),
    // https://p1.music.126.net/FeuE7WOAOGV61z7KtN8CsQ==/109951168561941429.jpg?param=200y200
    // https://p1.music.126.net/FeuE7WOAOGV61z7KtN8CsQ==/109951168561941429.jpg
    new CFG("music.163", /^(https?:\/\/p\d+\.music\.126\.net\/.+\/\d+\.jpg)(\?.+)?$/i, m => {
      if (m[1]) {
        document.location = m[1]
      }
    })
  ]
  for (const cfg of cfgs) {
    if ((m = url.match(cfg.match))) {
      if (cfg.run) {
        cfg.run(m)
      }
      break
    }
  }
})()