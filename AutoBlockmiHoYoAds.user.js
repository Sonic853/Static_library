// ==UserScript==
// @name         创作中心广告管理自动屏蔽米哈游相关的广告
// @namespace    http://853lab.com/
// @version      0.9
// @description  自动屏蔽在“创作中心”→“创作激励”→“广告管理”中与米哈游相关的广告。So FUCK YOU, miHoYo!
// @author       Sonic853
// @match        https://member.bilibili.com/*
// @match        https://cm.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

(async function () {
  'use strict'
  const DEV_Log = Boolean(localStorage.getItem("Dev-853"))
  const localItem = "BlockmiHoYoAds"
  const NAME = "Block miHoYo Ads"
  const D = () => {
    return new Date().toLocaleTimeString()
  }

  const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

  const RList = new class {
    time = 200
    #list = -1
    async Push() {
      this.#list++
      await snooze(this.#list * this.time)
      Promise.resolve().finally(() => {
        setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
      })
    }
  }

  if (typeof GM_xmlhttpRequest === 'undefined'
    && typeof GM_registerMenuCommand === 'undefined'
    && typeof GM_setValue === 'undefined'
    && typeof GM_getValue === 'undefined') {
    console.error(`[${NAME}][${D()}]: `, "GM is no Ready.")
  } else {
    console.log(`[${NAME}][${D()}]: `, "GM is Ready.")
  }

  let BLab8A = class {
    /**
     * @type {Object.<string, string>} data
     */
    data
    constructor() {
      this.data = this.load()
    }
    load() {
      console.log(`[${NAME}][${D()}]: `, "正在加载数据")
      const defaultData = "{}"
      if (typeof GM_getValue !== 'undefined') {
        let gdata = GM_getValue(localItem, JSON.parse(defaultData))
        return gdata
      } else {
        let ldata = JSON.parse(localStorage.getItem(localItem) === null ? defaultData : localStorage.getItem(localItem))
        return ldata
      }
    }
    save(d) {
      console.log(`[${NAME}][${D()}]: `, "正在保存数据")
      d === undefined ? (d = this.data) : (this.data = d)
      typeof GM_getValue != 'undefined' ? GM_setValue(localItem, d) : localStorage.setItem(localItem, JSON.stringify(d))
      return this
    }
  }
  let bLab8A = new BLab8A()

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

  class BV2AV {
    table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF"
    /**
     * @type {[key: string]: number}
     */
    tr = {}
    s = [11, 10, 3, 8, 4, 6]
    xor = 177451812
    add = 8728348608
    constructor() {
      for (let i = 0; i < 58; ++i) {
        this.tr[this.table[i]] = i
      }
    }
    /**
     * BV2AV
     * @param {string} x 
     * @returns {string}
     */
    dec(x) {
      let r = 0
      for (let i = 0; i < 6; ++i) {
        r += this.tr[x[this.s[i]]] * 58 ** i
      }
      return "av" + String((r - this.add) ^ this.xor)
    }
  }
  let bv2av = new BV2AV()

  class AdsManager {
    filter_ads_by_pageUrl = "https://cm.bilibili.com/meet/api/open_api/v1/up/web/trust_ad/filter_ads_by_page"
    filter_adsUrl = "https://cm.bilibili.com/meet/api/open_api/v1/up/web/trust_ad/filter_ads"
    keywords = [
      "原神",
      "崩坏学园",
      "崩坏学院",
      "miHoYo",
      "崩坏3",
      "崩坏三",
      // "女武神",
      "提瓦特大陆",
      // "好耶，是大冒险！",
      // "律者",
      "米哈游",
      "星穹铁道",
      "绝区零",
      // "为世界上所有的美好而战！",
      "未定事件簿",
      "米游社",
    ]
    PPC_keywords = [
      "bilibili://game_center/detail?id=103496&",
      "bilibili://game_center/detail?id=94&",
      "bilibili://game_center/detail?id=108434&",
      "bilibili://game_center/detail?id=107800&",
      "bilibili://game_center/detail?id=12&",
    ]
    get runningTime() {
      /**
       * @type {{
       * runningTime: number,
       * }}
       */
      let data = bLab8A.load()
      return data.runningTime === undefined ? 0 : data.runningTime
    }
    /** @param {number} v */
    set runningTime(v) {
      /**
       * @type {{
       * runningTime: number,
       * }}
       */
      let data = bLab8A.load()
      data.runningTime = v
      bLab8A.save(data)
    }
    async getAdsList(page = 1, size = 10, ad_title = "", trust_status = "") {
      console.log(`[${NAME}][${D()}]: `, `正在获取广告列表第${page}页`)
      let url = `${this.filter_ads_by_pageUrl}?page=${page}&size=${size}&ad_title=${ad_title}&trust_status=${trust_status}`
      /**
       * @type {{
       *  status: "success",
       *  current_time: number,
       *  result: {
       *   banned_num: number,
       *   data: {
       *    app_name: string,
       *    button_copy: string,
       *    creative_desc: string,
       *    creative_id: number,
       *    creative_title: string,
       *    grade: number,
       *    image_url: string,
       *    mtime: number,
       *    promotion_purpose_content: string,
       *    trust_status: number,
       *   }[],
       *   page: number,
       *   showed_num: number,
       *   total_count: number,
       *  }
       * }}
       */
      let data = JSON.parse(await HTTPSendPro({
        url,
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          referer: "https://cm.bilibili.com/divide/",
        }
      }, true))
      if (data.status == "success") {
        return {
          page: data.result.page,
          total_count: data.result.total_count,
          data: data.result.data
        }
      }
      console.error(data)
      return null
    }
    async getAdsAllList() {
      const _runningTime = Date.now()
      this.runningTime = _runningTime
      let page = 1
      let size = 10
      let ad_title = ""
      let trust_status = "1"
      let data = await this.getAdsList(page, size, ad_title, trust_status)
      let total_count = data.total_count
      let list = data.data
      while (page < total_count / size) {
        if (this.runningTime > _runningTime) {
          console.log(`[${NAME}][${D()}]: `, "其它相同脚本正在运行")
          return []
        }
        page++
        await RList.Push()
        data = await this.getAdsList(page, size, ad_title, trust_status)
        list = list.concat(data.data)
      }
      return list
    }
    /**
     *
     * @param {number} creative_ids
     * @param {number} trust_status
     */
    async setAdsTrustStatus(creative_ids, trust_status) {
      let url = this.filter_adsUrl
      let data = {
        creative_ids,
        trust_status
      }
      /**
       * @type {{
       *  status: "success",
       *  current_time: number,
       * }}
       */
      let result = JSON.parse(await HTTPSendPro({
        url,
        method: "POST",
        headers: {
          "content-type": "application/json",
          referer: "https://cm.bilibili.com/divide/",
          origin: "https://cm.bilibili.com"
        },
        data: JSON.stringify(data)
      }, true))
      let isSuccess = result.status == "success"
      if (!isSuccess) console.error(result)
      return isSuccess
    }
    /**
     * 
     * @param {string} aid 
     */
    async getTagsFromAid(aid) {
      await RList.Push()
      console.log(`[${NAME}][${D()}]: `, `正在获取视频 av${aid} 的 Tag`)
      let url = `https://api.bilibili.com/x/tag/archive/tags?aid=${aid}&_=${Math.round(new Date() / 1000)}`
      /**
       * @type {{
       *  code: number,
       *  message: string,
       *  ttl: number,
       *  data: {
       *   tag_id: number,
       *   tag_name: string,
       *  }[],
       * }}
       */
      let result = JSON.parse(await HTTPSendPro({
        url,
        method: "GET"
      }, true))
      if (result.code == 0) {
        return result.data.map((item) => item.tag_name)
      }
      console.error(result)
      return []
    }
    async getTagsFromBvid(bvid) {
      return await this.getTagsFromAid(bv2av.dec(bvid).slice(2))
    }
    async getDetailFromAid(aid) {
      await RList.Push()
      console.log(`[${NAME}][${D()}]: `, `正在获取视频 av${aid} 的详细信息`)
      let url = `https://api.bilibili.com/x/web-interface/view/detail?aid=${aid}`
      /**
       * @type {{
       * code: number,
       * message: string,
       * ttl: number,
       * data: {
       *  Tags: {
       *   tag_name: string,
       *   tag_id: number,
       *  }[],
       *  View: {
       *   aid: number,
       *   bvid: string,
       *   desc: string,
       *   title: string,
       *  }
       * }
       * }}
       */
      let result = JSON.parse(await HTTPSendPro({
        url,
        method: "GET"
      }, true))
      if (result.code == 0) {
        return {
          tags: result.data.Tags.map((item) => item.tag_name),
          title: result.data.View.title,
          desc: result.data.View.desc,
          aid: result.data.View.aid,
          bvid: result.data.View.bvid,
        }
      }
      return null
    }
    async getDetailFromBvid(bvid) {
      return await this.getDetailFromAid(bv2av.dec(bvid).slice(2))
    }
  }

  // 判断浏览器 url 是否为 https://cm.bilibili.com 开头
  if (location.href.startsWith("https://cm.bilibili.com")) {
  }
  else {
    let adsManager = new AdsManager()
    const startBlock = async () => {
      console.log(`[${NAME}][${D()}]: `, "获取广告列表")
      let list = await adsManager.getAdsAllList()
      /**
       * @type {{
       *  app_name: string;
       *  button_copy: string;
       *  creative_desc: string;
       *  creative_id: number;
       *  creative_title: string;
       *  grade: number;
       *  image_url: string;
       *  mtime: number;
       *  promotion_purpose_content: string;
       *  trust_status: number;
       * }[]}
       */
      let ads = []
      for (let item of list) {
        let isAds = false
        for (const keyword of adsManager.keywords) {
          if (item.creative_title.includes(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds) for (const keyword of adsManager.PPC_keywords) {
          if (item.promotion_purpose_content.startsWith(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds && (item.promotion_purpose_content.toLocaleLowerCase().startsWith('https://www.bilibili.com/video/')
          || item.promotion_purpose_content.toLocaleLowerCase().startsWith('http://www.bilibili.com/video/'))) {
          const vid = item.promotion_purpose_content.split('/')[4].split('?')[0]
          /**
           * @type {{
           *  tags: string[];
           *  title: string;
           *  desc: string;
           *  aid: number;
           *  bvid: string;
           *}}
           */
          let detail = null
          if (vid.startsWith("BV")) {
            detail = await adsManager.getDetailFromBvid(vid)
          }
          else if (vid.toLowerCase().startsWith("av")) {
            detail = await adsManager.getDetailFromAid(vid.slice(2))
          }
          if (detail) for (const keyword of adsManager.keywords) {
            if (isAds) break
            if (detail.title.includes(keyword)) {
              isAds = true
              break
            }
            if (detail.desc.includes(keyword)) {
              isAds = true
              break
            }
            for (const tag of detail.tags) {
              if (tag.includes(keyword)) {
                isAds = true
                break
              }
            }
          }
        }
        if (isAds) ads.push(item)
      }
      if (ads.length == 0) return console.log(`[${NAME}][${D()}]: `, "没有 miHoYo 相关的广告")
      let blocked = 0
      for (let item of ads) {
        console.log(`[${NAME}][${D()}]: `, `正在屏蔽广告：${item.creative_title}`)
        await RList.Push()
        let r = await adsManager.setAdsTrustStatus(item.creative_id, 0)
        console.log(`[${NAME}][${D()}]: `, r ? "屏蔽成功" : "屏蔽失败")
        if (r) blocked++
      }
      console.log(`[${NAME}][${D()}]: `, `已屏蔽 ${blocked} 条广告`)
    }
    GM_registerMenuCommand("Block miHoYo Ads", startBlock)
    try {
      await startBlock()
    } catch (error) {
      console.error(error)
    }
  }
})()
