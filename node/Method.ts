import readline from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { stringIsNullOrWhiteSpace } from '../Method'
const rl = readline.createInterface({ input, output })

export const getInput = async (question: string, failinput: string = '输入不能为空，请重新输入', exit: boolean = false, trim: boolean = true): Promise<string> => {
  const input = await rl.question(question)
  if (stringIsNullOrWhiteSpace(input)) {
    console.log(failinput)
    if (exit) {
      await rl.question('按任意键退出')
      process.exit(0)
    }
    return await getInput(question, failinput, exit)
  }
  if (trim) return input.trim()
  return input
}
export const getInputDefault = async (question: string, defaultinput: string, trim: boolean = true): Promise<string> => {
  const input = await rl.question(question)
  if (stringIsNullOrWhiteSpace(input)) {
    return defaultinput
  }
  if (trim) return input.trim()
  return input
}