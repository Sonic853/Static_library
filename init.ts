/**
 * 
 * @param {string} fmt 
 * @param {Date} date 
 * @returns 
 */
const dateFormat = (fmt: string, date?: Date | undefined) => {
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
