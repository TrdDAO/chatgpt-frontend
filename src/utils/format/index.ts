import { isType } from '../isType'
/**
 * 转义 HTML 字符
 * @param source
 */
export function encodeHTML(source: string) {
  return source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 判断是否为代码块
 * @param text
 */
export function includeCode(text: string | null | undefined) {
  const regexp = /^(?:\s{4}|\t).+/gm
  return !!(text?.includes(' = ') || text?.match(regexp))
}

/**
 * 复制文本
 * @param options
 */
export function copyText(options: { text: string; origin?: boolean }) {
  if(navigator.clipboard) {
    navigator.clipboard.writeText(options.text);
  } else {
    const props = { origin: true, ...options }

    let input: HTMLInputElement | HTMLTextAreaElement

    if (props.origin)
      input = document.createElement('textarea')
    else
      input = document.createElement('input')

    input.setAttribute('readonly', 'readonly')
    input.style.position = 'fixed';
    input.style.clip = 'rect(0 0 0 0)';
    input.value = props.text
    document.body.appendChild(input)
    input.select()
    if (document.execCommand('copy'))
      document.execCommand('copy', true)
    document.body.removeChild(input)
  }
}

/**
 * 请求的对象转字符串
 */
export const obj2UrlString = (queryParams:any):string => {
  return queryParams ?
    isType(queryParams, 'object') ? 
      Object.entries(queryParams).map((item:any) => `${item[0]}=${encodeURIComponent(item[1])}`).join('&')
      : String(queryParams) 
    : ''
}