// ==UserScript==
// @name         创作中心广告管理自动屏蔽米哈游相关的广告
// @namespace    http://853lab.com/
// @version      0.4
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

  /**
   * 
   * @param {any[]} arr 
   * @param {*} predicate 
   * @returns 
   */
  const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
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
      "女武神",
      "提瓦特大陆",
      "好耶，是大冒险！",
      "律者",
      "米哈游",
      "星穹铁道",
      "绝区零",
      "为世界上所有的美好而战！",
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
      let data = JSON.parse(await HTTPsend(url, "GET", {
        accept: "application/json, text/plain, */*",
        referer: "https://cm.bilibili.com/divide/",
      }))
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
      let result = JSON.parse(await HTTPsend(url, "POST", {
        "content-type": "application/json",
        referer: "https://cm.bilibili.com/divide/",
        origin: "https://cm.bilibili.com"
      }, undefined, JSON.stringify(data)))
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
      let result = JSON.parse(await HTTPsend(url, "GET"))
      if (result.code == 0) {
        return result.data.map((item) => item.tag_name)
      }
      console.error(result)
      return []
    }
    async getTagsFromBvid(bvid) {
      return await this.getTagsFromAid(bv2av.dec(bvid).slice(2))
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
      let ads = await asyncFilter(list, async (item) => {
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
         * }}
         */
        const _item = item
        let isAds = false
        for (const keyword of adsManager.keywords) {
          if (_item.creative_title.includes(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds) for (const keyword of adsManager.PPC_keywords) {
          if (_item.promotion_purpose_content.startsWith(keyword)) {
            isAds = true
            break
          }
        }
        if (!isAds && (_item.promotion_purpose_content.toLocaleLowerCase().startsWith('https://www.bilibili.com/video/')
          || _item.promotion_purpose_content.toLocaleLowerCase().startsWith('http://www.bilibili.com/video/'))) {
          const vid = _item.promotion_purpose_content.split('/')[4].split('?')[0]
          /**
           * @type {string[]}
           */
          let tags = []
          if (vid.startsWith("BV")) {
            tags = await adsManager.getTagsFromBvid(vid)
          }
          else if (vid.toLowerCase().startsWith("av")) {
            tags = await adsManager.getTagsFromAid(vid.slice(2))
          }
          for (const keyword of adsManager.keywords) {
            if (isAds) break
            for (const tag of tags) {
              if (tag.includes(keyword)) {
                isAds = true
                break
              }
            }
          }
        }
        return isAds
      })
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
