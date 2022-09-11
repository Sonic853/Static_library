// ==UserScript==
// @name             米哈游玩家指示器
// @namespace        http://853lab.com/
// @version          0.6
// @description      B站评论区自动标注米哈游玩家，依据是动态里是否有米哈游游戏的相关内容。灵感来自于原神玩家指示器。
// @author           Sonic853
// @match            https://www.bilibili.com/video/*
// @icon             https://static.hdslb.com/images/favicon.ico
// @run-at           document-end
// @license          MIT License
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @grant            GM_xmlhttpRequest
// @original-author  xulaupuz
// @original-license MIT
// @original-script  https://greasyfork.org/zh-CN/scripts/450720-%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8
// ==/UserScript==
// 凭实力走在对立面，
// 这就是我的觉悟。
// https://h.bilibili.com/67313825
// So FUCK YOU, miHoYo!

(async function () {
  'use strict'

  const DEV_Log = Boolean(localStorage.getItem("Dev-853"))
  const localItem = "miHoYoCheck"
  const NAME = "miHoYoCheck"
  const D = () => {
    return new Date().toLocaleTimeString()
  }
  const Console_log = function (...text) {
    let d = new Date().toLocaleTimeString()
    console.log(`[${NAME}][${d}]: `, ...text)
  }
  const Console_Devlog = function (...text) {
    let d = new Date().toLocaleTimeString()
    DEV_Log && (console.log(`[${NAME}][${d}]: `, ...text))
  }
  const Console_error = function (...text) {
    let d = new Date().toLocaleTimeString()
    console.error(`[${NAME}][${d}]: `, ...text)
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

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {Object.<string, any>} headers
   * @param {string} responseType
   * @param {*} successHandler
   * @param {*} errorHandler
   * @returns
   */
  let HTTPsend = function (url, method, headers, responseType, successHandler, errorHandler) {
    Console_Devlog(url)
    if (typeof GM_xmlhttpRequest != 'undefined') {
      return new Promise((rl, rj) => {
        try {
          GM_xmlhttpRequest({
            method,
            url,
            headers,
            responseType,
            onerror: function (response) {
              Console_Devlog(response.status)
              errorHandler && errorHandler(response.status)
              rj(response.status)
            },
            onload: function (response) {
              let status
              if (response.readyState == 4) { // `DONE`
                status = response.status
                if (status == 200) {
                  Console_Devlog(response.response)
                  successHandler && successHandler(response.response)
                  rl(response.response)
                } else {
                  Console_Devlog(status)
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
                Console_log(xhr.response)
                successHandler && successHandler(xhr.response)
                rl(xhr.response)
              } else {
                Console_log(status)
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

  let BLab8A = class {
    /**
     * @type {Object.<string, {
     * name: string,
     * uid: string
     *  }[]>} data
     */
    data
    constructor() {
      this.data = this.load()
    }
    load() {
      Console_log("正在加载数据")
      const defaultData = "{\"unknown\":[],\"miHoYo\":[],\"no_miHoYo\":[]}"
      if (typeof GM_getValue !== 'undefined') {
        let gdata = GM_getValue(localItem, JSON.parse(defaultData))
        return gdata
      } else {
        let ldata = JSON.parse(localStorage.getItem(localItem) === null ? defaultData : localStorage.getItem(localItem))
        return ldata
      }
    }
    save(d) {
      Console_log("正在保存数据")
      d === undefined ? (d = this.data) : (this.data = d)
      typeof GM_getValue != 'undefined' ? GM_setValue(localItem, d) : localStorage.setItem(localItem, JSON.stringify(d))
      return this
    }
  }
  let bLab8A = new BLab8A()


  GM_registerMenuCommand("清空插件所有数据", () => {
    if (!confirm("确定要清空数据吗？")) return
    bLab8A.data.miHoYo = []
    bLab8A.data.no_miHoYo = []
    bLab8A.save()
    Console_log("数据已清空")
  })
  GM_registerMenuCommand("清空插件里的米哈游玩家数据", () => {
    if (!confirm("确定要清空数据吗？")) return
    bLab8A.data.miHoYo = []
    bLab8A.save()
    Console_log("数据已清空")
  })
  GM_registerMenuCommand("清空插件里的非米哈游玩家数据", () => {
    if (!confirm("确定要清空数据吗？")) return
    bLab8A.data.no_miHoYo = []
    bLab8A.save()
    Console_log("数据已清空")
  })

  class Checker {
    running = false
    /**
       * @type {{
     * name: string,
     * uid: string,
     * dom: HTMLElement
     * }[]}
     */
    list = []
    // 原神 关键词 有待改进，因为会出现 还原神作 等误判断情况
    /**
     * 关键词检查
     */
    keywords = [
      "玩原神",
      "原神玩家",
      "#原神#",
      "【原神",
      "《原神",
      "[原神",
      "米哈游",
      "崩坏三",
      "崩坏3",
      "崩坏学园",
      "崩坏学院",
      "miHoYo",
      "崩坏星穹铁道",
      "崩坏:星穹铁道",
      "崩坏：星穹铁道",
      "未定事件簿",
      "绝区零",
      "米游社",
      // "鹿鸣",
    ]
    soeWithKeywords = [
      "原神",
    ]
    /**
     * 米哈游以及涉及米哈游的帐号
     */
    uids = [
      "256667467",
      "318432901",
      "133934",
      "27534330",
      "358367842",
      "1340190821",
      "401742377",
      "33307860",
      "52957002",
      "510189715",
      "488836173",
      "1636034895",
      "1340190821",
      "436175352",
    ]
    tag = "[米哈游玩家]"
    dynamicURL = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space"
    get is_new() {
      return document.querySelectorAll(".reply-list").length != 0
    }
    get getDom() {
      if (this.is_new) {
        return document.querySelectorAll(".reply-list")
        // sub-reply-list
      }
      else {
        return document.querySelectorAll(".comment-list")
        // reply-box
      }
    }
    /**
     * @param {HTMLElement} node 
     * @returns {{
     * name: string,
     * uid: string,
     * dom: HTMLElement
     * }}
     */
    getUser(node) {
      if (this.is_new) {
        // console.log(node)
        return {
          name: node.innerText,
          uid: node.getAttribute("data-user-id"),
          dom: node
        }
      }
      else {
        /** @type {HTMLAnchorElement} */
        let child = node.children[0]
        if (child.href == undefined) {
          for (let _child of node.children) {
            if (_child.href != undefined) {
              child = _child
              break
            }
          }
        }
        if (child === undefined && child.href == undefined) return
        // console.log(child)
        let uid = child.getAttribute("data-usercard-mid") === null ? child.href.replace(/[^\d]/g, "") : child.getAttribute("data-usercard-mid")
        return {
          name: child.innerText,
          uid,
          dom: child
        }
      }
    }
    getUserList() {
      /**
       * @type {{
       * name: string,
       * uid: string,
       * dom: HTMLElement
       * }[]}
       */
      let list = []
      if (this.is_new) {
        let users = document.querySelectorAll(".user-name")
        let subuser = document.querySelectorAll(".sub-user-name")
        for (let user of users) {
          let u = this.getUser(user)
          if (u != undefined
            && !list.some(e => e.uid == u.uid)) {
            {
              list.push(u)
            }
          }
        }
        for (let user of subuser) {
          let u = this.getUser(user)
          if (u != undefined
            && !list.some(e => e.uid == u.uid)) {
            {
              list.push(u)
            }
          }
        }
      }
      else {
        let users = document.querySelectorAll(".user")
        for (let user of users) {
          let u = this.getUser(user)
          if (u != undefined
            && !list.some(e => e.uid == u.uid)) {
            {
              list.push(u)
            }
          }
        }
      }
      return list
    }
    /**
     * @param {string} uid 
     * @param {string} offset
     */
    async getUserDynamic(uid, offset = "") {
      // ?offset=&host_mid=
      if (uid == undefined) return
      /**
       * @type {{
       * code: number,
       * message: string,
       * ttl: number,
       * data: {
       *  has_more: boolean,
       *  items: {
       *   id_str: string,
       *   modules: {
       *    module_dynamic: {
       *     desc?: {
       *      rich_text_nodes: {
       *       orig_text: string,
       *       text: string,
       *       type: string
       *      }[],
       *      text: string
       *     },
       *     major?: {
       *      archive: {
       *       aid: string,
       *       title: string,
       *       desc: string,
       *      }
       *     }
       *    }
       *   },
       *   orig?: {
       *    modules: {
       *     module_author: {
       *      mid: string,
       *      name: string
       *     },
       *     module_dynamic: {
       *      desc?: {
       *       rich_text_nodes: {
       *        orig_text: string,
       *        text: string,
       *        type: string
       *       }[],
       *       text: string
       *      },
       *      major?: {
       *       archive: {
       *        aid: string,
       *        title: string,
       *        desc: string,
       *       }
       *      }
       *     }
       *    },
       *    type: string
       *   },
       *   type: string
       *  }[],
       *  offset: string,
       *  update_baseline: string,
       *  update_num: number
       * }
       * }}
       */
      let data = JSON.parse(await HTTPsend(`${this.dynamicURL}?offset=${offset}&host_mid=${uid}`,
        "GET",
        {
          "Referer": `https://space.bilibili.com/${uid}/dynamic`,
        }
      ))
      if (data.code != 0) {
        console.error(`[${NAME}][${D()}]: `, data)
        return
      }
      let items = data.data.items
      return {
        items,
        offset: data.data.offset,
      }
    }
    /**
     * @param {{
       *   id_str: string,
     *   modules: {
     *    module_dynamic: {
     *     desc?: {
     *      rich_text_nodes: {
     *       orig_text: string,
     *       text: string,
     *       type: string
     *      }[],
     *      text: string
     *     },
     *     major?: {
     *      archive: {
     *       aid: string,
     *       title: string,
     *       desc: string,
     *      }
     *     }
     *    }
     *   },
     *   orig?: {
     *    modules: {
     *     module_author: {
     *      mid: string,
     *      name: string
     *     },
     *     module_dynamic: {
     *      desc?: {
     *       rich_text_nodes: {
     *        orig_text: string,
     *        text: string,
     *        type: string
     *       }[],
     *       text: string
     *      },
     *      major?: {
     *       archive: {
     *        aid: string,
     *        title: string,
     *        desc: string,
     *       }
     *      }
     *     }
     *    },
     *    type: string
     *   },
     *   type: string
     *  }[]} items
     */
    checkDynamicsIncludeKeyword(items) {
      for (let item of items) {
        if (this.checkDynamicIncludeKeyword(item)) {
          return true
        }
      }
      return false
    }
    /**
     * @param {{
       *   id_str: string,
     *   modules: {
     *    module_dynamic: {
     *     desc?: {
     *      rich_text_nodes: {
     *       orig_text: string,
     *       text: string,
     *       type: string
     *      }[],
     *      text: string
     *     },
     *     major?: {
     *      archive: {
     *       aid: string,
     *       title: string,
     *       desc: string,
     *      }
     *     }
     *    }
     *   },
     *   orig?: {
     *    modules: {
     *     module_author: {
     *      mid: string,
     *      name: string
     *     },
     *     module_dynamic: {
     *      desc?: {
     *       rich_text_nodes: {
     *        orig_text: string,
     *        text: string,
     *        type: string
     *       }[],
     *       text: string
     *      },
     *      major?: {
     *       archive: {
     *        aid: string,
     *        title: string,
     *        desc: string,
     *       }
     *      }
     *     }
     *    },
     *    type: string
     *   },
     *   type: string
     *  }} item
     */
    checkDynamicIncludeKeyword(item) {
      if (item == undefined) return false
      // for (let item of items) {
      if (item.modules.module_dynamic.desc != null) {
        if (this.checkKeyword(item.modules.module_dynamic.desc.text)) {
          return true
        }
      }
      switch (item.type) {
        case "DYNAMIC_TYPE_FORWARD":
          {
            if (item.orig != undefined) {
              for (let uid of this.uids) {
                if (item.orig.modules.module_author.mid == uid) {
                  return true
                }
              }
              switch (item.orig.type) {
                case "DYNAMIC_TYPE_DRAW":
                case "DYNAMIC_TYPE_COMMON_SQUARE":
                case "DYNAMIC_TYPE_WORD":
                  {
                    if (item.orig.modules.module_dynamic.desc != null) {
                      if (this.checkKeyword(item.orig.modules.module_dynamic.desc.text)) {
                        return true
                      }
                    }
                  }
                  break
                case "DYNAMIC_TYPE_AV":
                  {
                    if (item.orig.modules.module_dynamic.desc != null) {
                      if (this.checkKeyword(item.orig.modules.module_dynamic.desc.text)) {
                        return true
                      }
                    }
                    if (item.orig.modules.module_dynamic.major != null) {
                      Console_Devlog(item.orig.modules.module_dynamic.major)
                      if (this.checkKeyword(item.orig.modules.module_dynamic.major?.archive?.title)
                      || this.checkKeyword(item.orig.modules.module_dynamic.major?.archive?.desc)) {
                        return true
                      }
                    }
                  }
                  break
                case "DYNAMIC_TYPE_NONE":
                  {
                  }
                  break
              }
            }
          }
          break
        case "DYNAMIC_TYPE_AV":
          {
            if (item.modules.module_dynamic.major != null) {
              if (this.checkKeyword(item.modules.module_dynamic.major.archive.title)
              || this.checkKeyword(item.modules.module_dynamic.major.archive.desc)) {
                return true
              }
            }
          }
          break
        case "DYNAMIC_TYPE_DRAW":
        case "DYNAMIC_TYPE_WORD":
          {
          }
          break
        default:
          break
      }
      // }
      return false
    }
    checkKeyword(text) {
      if (text != null) {
        for (let keyword of this.keywords) {
          if (text.includes(keyword)) {
            return true
          }
        }
        for (let keyword of this.soeWithKeywords) {
          if (text.startsWith(keyword) || text.endsWith(keyword)) {
            return true
          }
        }
      }
      return false
    }
    async checkUser() {
      if (this.running) return
      if (this.list.length == 0) return
      this.running = true
      // 复制一份 this.list
      let list = this.list.slice()
      for (let user of list) {
        if (bLab8A.data.miHoYo.some(e => e.uid == user.uid)) {
          Console_log("已知的米哈游玩家", user)
          if (user.dom != undefined) {
            this.insertSpan(user.dom, this.tag)
          }
          continue
        }
        else if (bLab8A.data.no_miHoYo.some(e => e.uid == user.uid)) {
          Console_log("已知的非米哈游玩家", user)
          continue
        }
        Console_Devlog(`检查用户 ${user.name}`)
        await RList.Push()
        let dynamic = await this.getUserDynamic(user.uid)
        if (dynamic == undefined) continue
        if (dynamic.items.length == 0) continue
        let has_miHoYo = this.checkDynamicsIncludeKeyword(dynamic.items)
        if (has_miHoYo) {
          Console_log("米哈游玩家", user)
          bLab8A.data.miHoYo.push({
            uid: user.uid,
            name: user.name,
          })
          this.insertSpan(user.dom, this.tag)
        }
        else {
          await RList.Push()
          dynamic = await this.getUserDynamic(user.uid, dynamic.offset)
          if (dynamic != undefined
            && dynamic.items.length !== 0) {
            has_miHoYo = this.checkDynamicsIncludeKeyword(dynamic.items)
            if (has_miHoYo) {
              Console_log("米哈游玩家", user)
              bLab8A.data.miHoYo.push({
                uid: user.uid,
                name: user.name,
              })
              this.insertSpan(user.dom, this.tag)
            }
            else {
              Console_log("非米哈游玩家", user)
              bLab8A.data.no_miHoYo.push({
                uid: user.uid,
                name: user.name,
              })
            }
          }
          else {
            Console_log("非米哈游玩家", user)
            bLab8A.data.no_miHoYo.push({
              uid: user.uid,
              name: user.name,
            })
          }
        }
        bLab8A.save()
      }
      this.running = false
      // 删除已经检查过的用户
      for (let user of list) {
        this.list.splice(this.list.indexOf(user), 1)
      }
      if (this.list.length != 0) {
        this.checkUser()
      }
    }
    /**
     * @param {HTMLElement} dom 
     * @param {string} text 
     */
    insertSpan(dom, text) {
      if (dom != undefined) {
        if (dom.querySelector("span.check_tag") != null) {
          return
        }
        let span = document.createElement("span")
        span.classList.add("check_tag")
        span.style.color = "red"
        span.title = `非准确结果，是否为${text}请自行判断`
        span.innerText = text
        dom.appendChild(span)
      }
    }
  }
  let checker = new Checker()

  /**
   * @param {MutationRecord[]} mutationList 
   * @param {MutationObserver} observer 
   */
  let callback = (mutationList, observer) => {
    Console_Devlog(`[${NAME}][${D()}]: `, "callback", mutationList)
    let list = checker.getUserList()
    for (let item of list) {
      if (!checker.list.some(e => e.dom == item.dom)) {
        checker.list.push(item)
      }
    }
    checker.checkUser()
    // mutationList.forEach(mutation => {
    //   if (mutation.type == "childList") {
    //     // [0].addedNodes[0].children[1].children[0].children[0].href
    //     // mutation.addedNodes.forEach(node => {
    //     //   if (checker.is_new) {
    //     //     try {

    //     //     } catch (error) {

    //     //     }
    //     //   }
    //     //   else {
    //     //     try {
    //     //       console.log(node.childNodes[1].childNodes[0].childNodes[0].href)
    //     //     } catch (error) {

    //     //     }
    //     //   }
    //     // })
    //   }
    // })
  }

  /** @type {MutationObserverInit} */
  let observerOption = {
    childList: true,
    subtree: true,
  }

  let observer = new MutationObserver(callback)
  // while 检测 checker.getDom
  while (checker.getDom.length == 0) {
    console.log(`[${NAME}][${D()}]: `, "寻找中")
    await RList.Push()
  }
  for (let _dom of checker.getDom) {
    observer.observe(_dom, observerOption)
  }
  // observer.observe(checker.getDom[0], observerOption)
  Console_Devlog(`[${NAME}][${D()}]: `, "开始监听")

  // 先获取一次列表
  let list = checker.getUserList()
  for (let item of list) {
    if (!checker.list.some(e => e.dom == item.dom)) {
      checker.list.push(item)
    }
  }
  checker.checkUser()
})()