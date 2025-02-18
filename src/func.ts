/**
 * 缓存函数执行
 * @param fn 
 * @returns 
 */
export function memorize<T, K>(fn: (...args: string[]) => T) {
  let cache = {} as { [key: string]: T }
  let func = function (this: K, ...args: string[]) {
    let key = args.join("_");
    if (cache[key]) {
      console.debug("缓存命中：key值", key);
      return cache[key];
    }
    return (cache[key] = fn.apply(this, args));
  };
  return func;
}

//执行并打印执行消耗时间
export function timeCostSync<T>(fn: () => T, label: string) {
  console.time(label)
  let ret = fn();
  console.timeEnd(label)
  return ret;
}

//执行并打印执行消耗时间
export function timeCostASync<T = void>(fn: (done: () => void) => T, label: string) {
  console.time(label)
  const done = () => {
    console.timeEnd(label)
  }
  return fn(done);
}

/**
 * 依次执行传入方法
 * @param  funcs 函数列表
 * @returns 聚合后的func
 */
export function batch<K>(...funcs: ((...args: any[]) => void)[]) {
  funcs = funcs.filter(Boolean);
  return function (this: K, ...args: any[]) {
    for (let func of funcs) {
      func.apply(this, args);
    }
  };
}

/**
 * 同batch，只不过执行的函数只要返回了false，就不执行后面的函数
 * @param  funcs
 * @returns 聚合后的func
 */
export function bailBatch<K>(...funcs: ((...args: any[]) => void | false)[]) {
  funcs = funcs.filter(Boolean);
  return function (this: K, ...args: any[]) {
    for (let func of funcs) {
      let ret = func.apply(this, args);
      if (ret === false) {
        return;
      }
    }
  };
}

/**
 * 同bailBatch,加入对promise的支持
 * @param funcs
 * @returns 聚合后的func
 */
export function bailBatchAsync<K>(...funcs: ((...args: any[]) => Promise<void | false>)[]) {
  funcs = funcs.filter(Boolean);
  return async function (this: K, ...args: any[]) {
    for (let func of funcs) {
      let ret = await func.apply(this, args);
      if (ret === false) {
        return;
      }
    }
  };
}

/**
 * 创建promise执行链
 * @param fns 返回promise的函数数组
 * @returns 
 */
export function promiseChain(...fns: ((arg: unknown) => Promise<unknown>)[]) {
  return function call(initialArg: unknown) {
    fns.reduce(
      (acc, fn) => acc.then(fn),
      Promise.resolve(initialArg)
    )
  }
}