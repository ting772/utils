export function isObj(obj) {
  return isType(obj, 'object')
}

const _toString = Object.prototype.toString;
export function isType(obj: unknown, typeStr: string) {
  return _toString.call(obj).slice(8, -1).toLowerCase() === typeStr;
}

export function isUndef(o: any) {
  return o == undefined || o == null
}

export function isDef(o: any) {
  return !isUndef(o)
}

export function isFunc(o: any) {
  return typeof o == 'function'
}

export function isArray(o: any) {
  return Array.isArray ? Array.isArray(o) : isType(o, 'array')
}