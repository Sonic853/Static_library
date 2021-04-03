// ==UserScript==
// @name         "我进入直播间辣"B站的进入直播间搭建──厌世
// @namespace    http://blog.853lab.com/
// @version      0.1
// @description  个人的自我了结式代码
// @author       Sonic853
// @match        https://live.bilibili.com/15667
// @grant        none
// @run-at       document-end
// @license      THE COFFEEWARE LICENSE
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// ==/UserScript==
//
// 律师函收到之日，即是我死期到来之时。
// 学写代码学到现在也不过是一枚棋子，随用随弃。
// ：）
//
// 为什么要写这个？那是因为有个人开了老爷后骗我。
// 然后，写这个破站的脚本越多，了结自己的几率越大，反正，没人会给我工作，只会有人给我带来灾难，
// 滚吧，这个世界。
// 我要在自己身上做这个实践，放在它们面前的就是这个开关：
// https://t.bilibili.com/4553329?type=2

(function () {
    'use strict';

    // Your code here...
    // bili_jct == csrf_token

    const localItem = "Lab8R"
    const Console = new class {
        NAME = "进入直播间"
        DEV_Log = Boolean(localStorage.getItem("Dev-853"))
        log(text) {
            console.log(`[${this.NAME}][${new Date().toLocaleTimeString()}]: ${text}`)
        }
        Devlog(text) {
            if (this.DEV_Log) console.log(`[${this.NAME}][${new Date().toLocaleTimeString()}]: ${text}`)
        }
        error(text) {
            console.error(`[${this.NAME}][${new Date().toLocaleTimeString()}]: ${text}`)
        }
    }
    if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM_registerMenuCommand === 'undefined' && typeof GM_setValue === 'undefined' && typeof GM_getValue === 'undefined') {
        Console.error("GM is no Ready.")
    } else {
        Console.log("GM is Ready.")
    }
    const LocalStorage = new class {
        /**
         * 
         * @param {string} item 
         * @param {*} def 
         * @returns {Promise<def>}
         */
        async getItem(item, def) {
            if (typeof GM_getValue !== 'undefined') {
                return await GM_getValue(item, def)
            } else {
                return localStorage.getItem(item) ?? def
            }

        }
        /**
         * 
         * @param {string} item 
         * @param {*} text 
         * @returns 
         */
        async setItem(item, text) {
            if (typeof GM_setValue !== 'undefined') {
                return await GM_setValue(item, text)
            } else {
                return localStorage.setItem(item, text)
            }
        }
    }
    /**
     * 获取cookie
     * @param name
     * @returns {string}
     */
    let getCookie = (name) => {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"))
        if (arr != null) return unescape(arr[2])
        return ""
    }
    /**
     * 异步延迟执行
     */
    const RList = new class {
        time = 3000
        #list = -1
        waitime = ms => new Promise(resolve => setTimeout(resolve, ms))
        async Push() {
            this.#list++
            await this.waitime(this.#list * this.time)
            Promise.resolve().finally(() => {
                setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
            })
        }
    }
    const JTF = (json) => {
        let f = new FormData()
        const ks = Object.keys(json)
        for (const k of ks) {
            f.append(k, json[k])
        }
        return f
    }
    const JTS = (json) => {
        let s = ""
        const ks = Object.keys(json)
        for (const k of ks) {
            if (s !== "") s += `&${k}=${json[k]}`
            else s += `${k}=${json[k]}`
        }
        return s
    }

    const HTTP = new class {
        /**
         * 发送一个请求
         * @param {string} url 
         * @param {"GET"|"POST"|"PUT"|"DELETE"|"OPTIONS"|"HEAD"} method 
         * @param {string} data 
         * @param {string} Type 
         * @param {Function} successHandler 
         * @param {Function} errorHandler 
         * @returns {Promise<string>}
         */
        request(url, method, data, Type, successHandler, errorHandler) {
            Console.Devlog(url)
            if (typeof GM_xmlhttpRequest != 'undefined') {
                return new Promise((rl, rj) => {
                    try {
                        GM_xmlhttpRequest({
                            method: method ?? "GET",
                            url: url,
                            data,
                            responseType: Type ?? "text",
                            onerror: function (response) {
                                Console.Devlog(response.status)
                                errorHandler && errorHandler(response.status)
                                rj(response.status)
                            },
                            onload: function (response) {
                                let status
                                if (response.readyState == 4) { // `DONE`
                                    status = response.status
                                    if (status == 200) {
                                        Console.Devlog(response.response)
                                        successHandler && successHandler(response.response)
                                        rl(response.response)
                                    } else {
                                        Console.Devlog(status)
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
                        xhr.responseType = Type ?? "text"
                        xhr.onreadystatechange = function () {
                            let status
                            if (xhr.readyState == 4) { // `DONE`
                                status = xhr.status
                                if (status == 200) {
                                    Console.log(xhr.response)
                                    successHandler && successHandler(xhr.response)
                                    rl(xhr.response)
                                } else {
                                    Console.log(status)
                                    errorHandler && errorHandler(status)
                                    rj(status)
                                }
                            }
                        }
                        if (data) xhr.send(data)
                        else xhr.send()
                    } catch (error) {
                        rj(error)
                    }
                })
            }
        }
        async get(url, type) {
            return await this.request(url, "GET", undefined, type)
        }
        async post(url, data, type) {
            return await this.request(url, "POST", data, type)
        }
    }
    class User {
        /**
         * @type {string}
         */
        csrf_token
        /**
         * @type {number}
         */
        wait_time = 300000
        wvr = ["15667"]
        constructor() {
            this.csrf_token = getCookie("bili_jct")
        }
        load() {
            LocalStorage.getItem(localItem, { wait_time: this.wait_time, wvr: this.wvr }).then(e => {
                const ks = Object.keys(e)
                for (const k of ks) {
                    if (this.hasOwnProperty(k)) this[k] = e[k]
                }
            })
            this.save()
        }
        save() {
            LocalStorage.setItem(localItem, { wait_time: this.wait_time, wvr: this.wvr })
        }
        async visitroom() {
            for (let i = 0; i < this.wvr.length; i++) {
                const e = this.wvr[i]
                await RList.Push()
                let r = await HTTP.post("https://api.live.bilibili.com/xlive/web-room/v1/index/roomEntryAction", JTS({
                    room_id: e,
                    platform: "pc",
                    csrf_token: this.csrf_token,
                    csrf: this.csrf_token,
                    visit_id: ""
                }))
                console.log(r)
            }
            return
            // await RList.waitime(this.wait_time)
            // this.visitroom()
        }
    }
    let user = new User()

    GM_registerMenuCommand("发送请求", () => {
        user.visitroom()
    })
    GM_registerMenuCommand("设置直播间", () => {
        user.wvr = prompt("输入直播间号，英文逗号分隔。", user.wvr.join(",")).split(",")
        this.save()
    })
})();
