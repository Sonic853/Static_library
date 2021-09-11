// ==UserScript==
// @name         Aria2 RPC Edit
// @namespace    Sonic853
// @version      0.2
// @description  Aria2 RPC Library 重写，参考自 https://greasyfork.org/scripts/5672-aria2-rpc
// @author       Sonic853
// @original-author moe.jixun
// @original-license MIT
// @original-script https://greasyfork.org/scripts/5672-aria2-rpc
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// tsc .\aria2.ts --target esnext
// Public Class Aria2 ( options )
interface Aria2Options {
    auth?: {
        type: Aria2AUTH,
        user?: string,
        pass?: string
    }
    host?: string
    post?: number
}
interface AriaBase {
    jsonrpc_ver: string
    id: number
    options: Aria2Options
    doRequest: Aria2Request
    getBasicAuth(): string
    send(bIsDataBatch: boolean, data: any, cbSuccess?: Function, cbError?: Function): Promise<any>
    addUri?(...args): Promise<XhrResponse>
    addTorrent?(...args): Promise<XhrResponse>
    addMetalink?(...args): Promise<XhrResponse>
    remove?(...args): Promise<XhrResponse>
    forceRemove?(...args): Promise<XhrResponse>
    pause?(...args): Promise<XhrResponse>
    pauseAll?(...args): Promise<XhrResponse>
    forcePause?(...args): Promise<XhrResponse>
    forcePauseAll?(...args): Promise<XhrResponse>
    unpause?(...args): Promise<XhrResponse>
    unpauseAll?(...args): Promise<XhrResponse>
    tellStatus?(...args): Promise<XhrResponse>
    getUris?(...args): Promise<XhrResponse>
    getFiles?(...args): Promise<XhrResponse>
    getPeers?(...args): Promise<XhrResponse>
    getServers?(...args): Promise<XhrResponse>
    tellActive?(...args): Promise<XhrResponse>
    tellWaiting?(...args): Promise<XhrResponse>
    tellStopped?(...args): Promise<XhrResponse>
    changePosition?(...args): Promise<XhrResponse>
    getOption?(...args): Promise<XhrResponse>
    changeOption?(...args): Promise<XhrResponse>
    getGlobalOption?(...args): Promise<XhrResponse>
    changeGlobalOption?(...args): Promise<XhrResponse>
    getGlobalStat?(...args): Promise<XhrResponse>
    purgeDownloadResult?(...args): Promise<XhrResponse>
    removeDownloadResult?(...args): Promise<XhrResponse>
    getVersion?(...args): Promise<XhrResponse>
    getSessionInfo?(...args): Promise<XhrResponse>
    shutdown?(...args): Promise<XhrResponse>
    forceShutdown?(...args): Promise<XhrResponse>
    saveSession?(...args): Promise<XhrResponse>
}
interface Aria2Request {
    parent: AriaBase
    send(payload: Aria2payload): Promise<XhrResponse>
}
enum Aria2AUTH {
    noAuth = 0,
    basic = 1,
    secret = 2
}
class Aria2BATCH {
    parent: AriaBase
    constructor(obj: AriaBase) {
        this.parent = obj
    }
}
interface Aria2payload {
    method?: "GET" | "HEAD" | "POST",
    url?: string,
    headers?: { [key: string]: string },
    data?: any,
    binary?: boolean,
    responseType?: "arraybuffer" | "blob" | "json",
    overrideMimeType?: string,
    user?: string,
    username?: string,
    password?: string,

    onload?: Function,
    onerror?: Function
}
interface XhrResponse {
    finalUrl?: string,
    readyState: 0 | 1 | 2 | 3 | 4,
    responseHeaders: string | Headers,
    status: number,
    statusText: string,
    response: any,
    responseText: string,
    responseXML?: Document | null
}
// var GM_fetch = async (input: RequestInfo, init?: RequestInit): Promise<any> => {
//     // Promise<Response>
//     if (typeof GM_xmlhttpRequest !== 'undefined') {
//         return new Promise((resolve, reject)=>{
//             if (typeof input === 'string') {

//             }
//             else {

//             }
//         });
//     }else{
//         console.warn([
//             'Warning: You are now using an simple implementation of GM_xmlhttpRequest',
//             'Cross-domain request are not avilible unless configured correctly @ target server.',
//             '',
//             'Some of its features are not avilible, such as `username` and `password` field.'
//         ].join('\n'))
//         return fetch(input, init)
//     }
// }

var Aria2 = class AriaBase {
    jsonrpc_ver = '2.0'
    id: number
    options: Aria2Options
    doRequest: Aria2Request
    getBasicAuth() {
        return btoa(`${this.options.auth.user}:${this.options.auth.pass}`)
    }
    async send(bIsDataBatch: boolean, data: any, cbSuccess?: Function, cbError?: Function) {
        this.id = (+ new Date())
        let srcTaskObj = { jsonrpc: this.jsonrpc_ver, id: this.id }
        let payload: Aria2payload = {
            method: 'POST',
            url: `http://${this.options.host}:${this.options.post}/jsonrpc`,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: bIsDataBatch
                ? data.map(e => { return this.merge({}, srcTaskObj, e) })
                : this.merge({}, srcTaskObj, data),
            onload: r => {
                let repData = JSON.parse(r.responseText)
                if (repData.readyState !== 4) {
                    cbError && cbError(repData, false)
                } else {
                    cbSuccess && cbSuccess(repData);
                }
            },
            onerror: cbError ? cbError(null, false) : null
        }
        switch (this.options.auth.type) {
            case Aria2AUTH.basic: {
                payload.headers.Authorization = 'Basic ' + this.getBasicAuth()
                break
            }
            case Aria2AUTH.secret: {
                let sToken = `token:${this.options.auth.pass}`
                if (bIsDataBatch) {
                    for (let i = 0; i < payload.data.length; i++) {
                        payload.data[i].params.splice(0, 0, sToken);
                    }
                } else {
                    if (!payload.data.params)
                        payload.data.params = [];
                    payload.data.params.splice(0, 0, sToken);
                }
                break;
            }
            case Aria2AUTH.noAuth:
            default: {
                break
            }
        }
        return await this.doRequest.send(payload)
    }
    Batch = new Aria2BATCH(this)
    private merge(...args) {
        let base = args[0]
        let _isObject = function (obj) {
            return obj instanceof Object;
        };
        let _merge = function (...args) {
            let argL = args.length
            for (let i = 1; i < argL; i++) {
                Object.keys(args[i]).forEach(function (key) {
                    if (_isObject(args[i][key]) && _isObject(base[key])) {
                        base[key] = _merge(base[key], args[i][key])
                    } else {
                        base[key] = args[i][key]
                    }
                })
            }
            return base
        }
        return _merge(...args)
    }
    constructor(options?: Aria2Options) {
        if (options) {
            if (!options.auth) options.auth = { type: Aria2AUTH.noAuth }
            if (typeof options.host !== 'string') options.host = 'localhost'
            if (typeof options.post !== 'number') options.post = 6800
            this.options = options
        }
        else this.options = {
            auth: {
                type: Aria2AUTH.noAuth
            },
            host: 'localhost',
            post: 6800
        }
        let isFunction = (obj: any) => {
            return typeof obj === 'function'
        }
        this.id = (+ new Date())
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            this.doRequest = new class {
                parent: AriaBase
                async send({ url, method, data, headers, onload, onerror }: Aria2payload): Promise<XhrResponse> {
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            url,
                            method,
                            data: typeof data === 'string' ? data : JSON.stringify(data),
                            headers,
                            onload(r) {
                                onload && onload(r.responseText)
                                resolve(r)
                            },
                            onerror() {
                                onerror && onerror()
                                reject()
                            }
                        });
                    })
                }
                constructor(obj: AriaBase) {
                    this.parent = obj
                }
            }(this)
        }
        else {
            console.warn([
                'Warning: You are now using an simple implementation of GM_xmlhttpRequest',
                'Cross-domain request are not avilible unless configured correctly @ target server.',
                '',
                'Some of its features are not avilible, such as `username` and `password` field.'
            ].join('\n'))
            this.doRequest = new class {
                parent: AriaBase
                async send({ url, method, data, headers, onload, onerror }: Aria2payload): Promise<XhrResponse> {
                    try {
                        let response = await fetch(url,{
                            method,
                            body: typeof data === 'string' ? data : JSON.stringify(data),
                            headers
                        })
                        let responseText = await response.text()
                        onload && onload(responseText)
                        return {
                            readyState:4,
                            responseHeaders: response.headers,
                            status: response.status,
                            statusText: response.statusText,
                            response,
                            responseText,
                            finalUrl: response.url
                        }
                    } catch (error) {
                        onerror && onerror(error)
                        return
                    }
                }
                constructor(obj: AriaBase) {
                    this.parent = obj
                }
            }(this)
        }
        {
            [
                "addUri", "addTorrent", "addMetalink", "remove", "forceRemove",
                "pause", "pauseAll", "forcePause", "forcePauseAll", "unpause",
                "unpauseAll", "tellStatus", "getUris", "getFiles", "getPeers",
                "getServers", "tellActive", "tellWaiting", "tellStopped",
                "changePosition", "changeUri", "getOption", "changeOption",
                "getGlobalOption", "changeGlobalOption", "getGlobalStat",
                "purgeDownloadResult", "removeDownloadResult", "getVersion",
                "getSessionInfo", "shutdown", "forceShutdown", "saveSession"
            ].forEach(sMethod => {
                this[sMethod] = async (...args) => {
                    let cbSuccess, cbError
                    if (args.length && isFunction(args[args.length - 1])) {
                        cbSuccess = args[args.length - 1]
                        args.splice(-1, 1)
                        if (args.length && isFunction(args[args.length - 1])) {
                            cbError = cbSuccess
                            cbSuccess = args[args.length - 1]
                            args.splice(-1, 1)
                        }
                    }
                    return await this.send(false, {
                        method: `aria2.${sMethod}`,
                        params: args
                    }, cbSuccess, cbError);
                }
            })
        }
    }
}