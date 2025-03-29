import { isObj } from './isType'

const _hasOwn = Object.prototype.hasOwnProperty;
export function hasOwn(obj: object, prop: string) {
  return _hasOwn.call(obj, prop);
}

export function getSignal<T = any>() {
  let resolve: (res?: any) => void, reject: (err?: any) => void
  let p = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    signal: p,
    resolve: resolve!,
    reject: reject!,
  };
}

/**
 * 深拷贝，未考虑循环引用
 * @param obj 
 * @returns 
 */
export function deepCopy(obj: any): any {
  if (["boolean", "number", "string"].includes(typeof obj)) {
    return obj;
  }
  if (isObj(obj)) {
    let ret = {} as any
    for (let key in (obj)) {
      if (hasOwn(obj, key)) {
        ret[key] = deepCopy(obj[key]);
      }
    }
    return ret;
  }

  if (Array.isArray(obj)) {
    return obj.map((item: any) => deepCopy(item));
  }

  throw Error("不支持非对象，数组，基础类型数据拷贝");
}

/**
 * 获取数组最后的元素
 * @param arr 数组
 * @returns 最后的元素
 */
export function arrLast(arr: unknown[]) {
  return arr[arr.length - 1];
}

/**
 * 字符串首字母大写
 * @param string 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string) {
  return str.replace(/(^\w)/, (s) => s.toUpperCase());
}

/**
 * 执行回调n次
 * @param cb 回调
 * @param n 次数
 */
export function loopN(cb: (index: number) => void, n: number, ctx?: any) {
  for (let i = 0; i < n; i++) {
    cb.call(ctx, i);
  }
}

/**
 * 执行回调n次
 * @param cb 回调
 * @param n 次数
 */
export function loopNGetResult<T>(cb: (index: number) => T, n: number, ctx?: any) {
  let result = [] as T[]
  for (let i = 0; i < n; i++) {
    result.push(cb.call(ctx, i));
  }
  return result
}

/**
 * 忽略对象中的某些属性，并返回剩余属性组成的对象
 * @param obj 对象
 * @param removedKeys 
 * @returns 
 */
export function omit<T extends object, K extends keyof T>(obj: T, removedKeys: K[]) {
  let ret = {} as Omit<T, K>
  for (let key in obj) {
    if (hasOwn(obj, key) && !removedKeys.includes(key as any)) {
      ((ret as any)[key]) = obj[key]
    }
  }
  return ret
}

/**
 * 递归获取某对象某key的数据 ，segString以点分key的形式，如
 * topLevelObj
 *      {
 *         A:{
 *            B:'Hello'
 *         }
 *      }
 * segString 如'A.B'
 *
 * @param  topLevelObj 对象数据
 * @param  segString   点分字符串
 * @returns
 */
export function getField(topLevelObj: object, segString?: string) {
  if (!segString) {
    return topLevelObj;
  }
  let val: any, segs = segString.split(".");
  try {
    val = segs.reduce((acc: any, seg) => {
      return acc[seg];
    }, topLevelObj);
  } catch { }
  return val;
}

/**
 * 缓存请求
 * @param fn 
 * @returns 
 */
export function reqMemo<T>(fn: (...args: string[]) => Promise<T>) {
  let cache = {} as { [key: string]: T }

  return async function (this: any, ...args: string[]) {
    let key = args.join("_");
    if (cache[key]) {
      console.debug("请求缓存命中：key值", key);
      return Promise.resolve(cache[key]);
    }
    return fn.apply(this, args).then((res: T) => {
      cache[key] = res;
      return res;
    });
  };
}

/**
 * 将数组切片
 * @param list 待切片数组
 * @param count 每次切片数量
 * @returns 
 */
export function chunk<T>(list: T[], count: number) {
  let copy = [...list];
  let ret = [] as T[][];
  do {
    let piece = copy.splice(0, count);
    if (piece.length == 0) break;
    ret.push(piece);
  } while (copy.length > 0);
  return ret;
}

/**
 * 延迟
 * @param idle delay的时间，单位ms
 * @returns 
 */
export function delay(idle: number) {
  return new Promise((resolve) => setTimeout(resolve, idle));
}

/**
 * 交换数组中index1和index2处的元素
 * @param arr 数组
 * @param index1 索引
 * @param index2 索引
 */
export function swapArrayItem(arr: [], index1: number, index2: number) {
  let temp = arr[index1]
  arr[index1] = arr[index2]
  arr[index2] = temp
}

/**
 * 发送一个请求promise，并设置超时计时器，该promise如果在超时范围内resolve则成功，否则失败
 * @param promise - 请求promise
 * @param timeout - 超时时间（单位ms）
 * @returns {promise}
 */
export function wait<T>(promise: Promise<T>, timeout: number) {
  let timer: any
  return Promise.race([promise.then(res => {
    clearTimeout(timer)
    return res
  }), new Promise((resolve, reject) => {
    timer = setTimeout(reject, timeout, '超时')
  })]) as Promise<T>
}

/**
 * 模拟随机触发异常
 */
export function simulateError<T = any>(error?: T) {
  if (Math.random() > 0.5) {
    throw error ?? Error("模拟错误触发")
  }
}

/**
 * 可阅读化方式展示文件大小
 * @param {number} size - 文件大小（B） 
 * @param {number} [pres=1] - 展示小数点精度 
 * @returns {string}
 */
export function fileSizeStr(size: number, pres = 1) {
  const units = [
    "B",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
  ];
  const exponent = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1,
  );
  const approx = size / 1024 ** exponent;
  return exponent === 0
    ? `${size} 字节`
    : `${approx.toFixed(pres)} ${units[exponent]}（${size} 字节）`;
}

/**
 * 获取今日0时0分0秒的时间戳
 * @returns {number}
 */
export function getTodayTimeStamp() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

let _toString = Object.prototype.toString
/**
 * 获取数据的类型
 * @param {*} obj 
 * @returns {string} 如object，number，array等
 */
export function getType(obj: any) {
  return _toString.call(obj).slice(8, -1).toLowerCase()
}
