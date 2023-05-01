/**
 * 
 * @param {string} fmt 
 * @param {Date} date 
 * @returns 
 */
export const dateFormat = (fmt: string, date?: Date | undefined) => {
  if (date === undefined) date = new Date()
  const hours = date.getHours()
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": hours.toString(),                     // 24时
    "h+": ((hours > 12) ? hours - 12 : hours).toString(),  // 12时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString(),         // 秒
    "t+": ((hours >= 12) ? "下午" : "上午")      // 上下午
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  let r: RegExpExecArray | null
  for (const k in opt) {
    if (isValidKey(k, opt)) {
      r = new RegExp("(" + k + ")").exec(fmt)
      if (r) {
        let o: string = opt[k]
        fmt = fmt.replace(r[1], (r[1].length == 1) ? (o) : (o.padStart(r[1].length, "0")))
      }
    }
  }
  return fmt
}
export const isValidKey = (key: string, obj: object): key is keyof typeof obj => {
  return obj.hasOwnProperty(key)
}
export const stringIsNullOrEmpty = (value: string | null | undefined): value is null => {
  return value === null || value === undefined || value === ""
}
export const stringIsNullOrWhiteSpace = (value: string | null | undefined): value is null => {
  return value !== null && value !== undefined && value.trim() === "" || stringIsNullOrEmpty(value)
}
export const getInput = (question: string, failinput: string = "输入不能为空，请重新输入", exit: boolean = false, trim: boolean = true): string | null => {
  const input = prompt(question)
  if (stringIsNullOrWhiteSpace(input)) {
    alert(failinput)
    if (exit) {
      return null
    }
    return getInput(question, failinput, exit)
  }
  if (trim) return input.trim()
  return input
}
export const getInputDefault = (question: string, defaultinput: string, trim: boolean = true): string => {
  const input = prompt(question)
  if (stringIsNullOrWhiteSpace(input)) {
    return defaultinput
  }
  if (trim) return input.trim()
  return input
}
export class EventEmiter {
  static events = new Map()
  static on(event: string, listener: (...args: any[]) => void) {
    // @ts-ignore
    if (typeof this.events[event] !== "object") {
      // @ts-ignore
      this.events[event] = []
    }
    // @ts-ignore
    this.events[event].push(listener)
    return () => this.removeListener(event, listener)
  }
  static removeListener(event: string, listener: (...args: any[]) => void) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    const idx = this.events[event].indexOf(listener)
    if (idx > -1) {
      // @ts-ignore
      this.events[event].splice(idx, 1)
    }
  }
  static emit(event: string, ...args: any[]) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    this.events[event].forEach((listener) => listener.apply(this, args))
  }
  static once(event: string, listener: (...args: any[]) => void) {
    const remove = this.on(event, (...args) => {
      remove()
      listener.apply(this, args)
    })
  }
  static removeAllListeners(event: string) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    this.events[event] = []
  }
}
export const Snooze = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
export class RList {
  static time = 500
  static #list = -1
  static async Push() {
    this.#list++
    await Snooze(this.#list * this.time)
    Promise.resolve().finally(() => {
      setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
    })
  }
}