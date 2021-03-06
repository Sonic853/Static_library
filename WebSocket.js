class WS {
    ip = ""
    port = ""
    ws
    #delegats = new Delegates()
    #retry = 0
    realclose = true
    #hbData = ""
    #hbTime = 30000
    #hbInterval = null
    constructor(ip, port) {
        this.ip = ip
        this.port = port
    }
    async connect(callback) {
        this.ws = new WebSocket("ws://"+this.ip+":"+this.port)
        this.ws.onopen = e => {
            this.#retry = 0
            if(this.#hbData!=="") this.#hbInterval = setInterval(() => {
                this.ws.send(this.#hbData)
            }, this.#hbTime)
            return callback ? callback() : Promise.resolve()
        }
        this.ws.onmessage = e => {
            this.#delegats.run(e)
        }
        this.ws.onclose = async e => {
            if (!this.realclose) {
                clearInterval(this.#hbInterval)
                this.#hbInterval = null
                if (this.#retry >= 5) await RList.Push()
                this.#retry++
                this.connect()
            }
        }
    }
    send(data) {
        this.ws.send(data)
    }
    message(callback) {
        return this.#delegats.push(callback)
    }
    close() {
        this.realclose = true
        this.ws.close()
    }
    setHeartbeat({ data = "", time = 0 }) {
        if(typeof data == "object") data = JSON.stringify(data) 
        this.#hbTime = time
        this.#hbData = data
    }
}

// // 建立连接对象
// let socket = new WS("127.0.0.1", "8080")

// // 写入收到消息的方法
// socket.message(data => {
//     console.log(data)
// })

// // 开始连接
// socket.connect()

// // 发送消息
// socket.send("Hello")

const getUuid = () => {
    let s = []
    let hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = "4"
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = "-"
    let uuid = s.join("")
    return uuid
}
class Delegates {
    item = class {
        constructor(e) {
            this.id = getUuid()
            this.e = e
        }
    }
    constructor() {
        this.list = new Array()
    }
    run(t) {
        if (this.list.length != 0) for (let i = 0; i < this.list.length; i++) {
            setTimeout(() => { this.list[i].e(t) })
        }
    }
    push(e) {
        let z = new this.item(e)
        this.list.push(z)
        return z.id
    }
    remove(e) {
        i = this.check(e)
        if (typeof i === "number") {
            this.list.splice(i, 1)
            return this.list
        } else {
            return false
        }
    }
    check(e) {
        let i
        if (typeof e == "number") {
            i = e
        } else {
            let z = -1
            for (let a = 0; a < this.list.length; a++) {
                const q = this.list[a]
                if (q.id != e) continue
                z = i = a
                break
            }
            if (z == -1) {
                return false
            }
        }
        return i
    }
}
const RList = new class {
    time = 3000
    #list = -1
    snooze = ms => new Promise(resolve => setTimeout(resolve, ms))
    async Push() {
        this.#list++
        await this.snooze(this.#list * this.time)
        Promise.resolve().finally(() => {
            setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
        })
    }
}