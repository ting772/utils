import { isObj } from "./isType";
import type { RemoveReadonly } from './typings/main'

type StyleObj = { [key: string]: string | number }
/**
 * 将样式对象拼接成style字符串
 * @param obj 样式对象
 * @returns 
 */
export function styleStr(obj: StyleObj) {
  let str = "";
  for (let key in obj) {
    str += `${key}:${obj[key]};`;
  }
  return str;
}

type SingleChildType = string | number | Node
type ChildType = string | number | Node | SingleChildType[]


/**
 * 创建元素
 * @param tag 标签
 * @param param1 样式对象和类
 * @param children 子元素
 * @returns 
 */
export function createElement(tag: string, { claz, style }: { claz: string | string[]; style: StyleObj }, children: ChildType) {
  const appendChild = (el: HTMLElement, child: string | number | Node) => {
    let type = typeof child;
    if (type == "string" || type == "number") {
      el.innerHTML = child as string;
    } else if ((child as Node).nodeType) {
      el.appendChild(child as Node);
    }
  };

  let el = document.createElement(tag) as RemoveReadonly<HTMLElement, 'style'>

  if (claz) el.classList.add(...(typeof claz == 'string' ? [claz] : claz));
  if (style) el.style = styleStr(style) as unknown as CSSStyleDeclaration;
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        appendChild(el, child);
      });
    } else {
      appendChild(el, children);
    }
  }
  return el;
}

/**
 * 为元素注册事件，并返回取消注册
 * @param ele 可绑定事件的目标
 * @param evtname 事件名
 * @param handler 事件处理回调
 * @param options 配置
 * @param options.needLog 是否需要开启调试打印
 * @param options.immediate 是否立即执行一次handler
 * @returns 
 */
export function registEvent(ele: EventTarget, evtname: string, handler: (e?: Event) => void, options?: { needLog?: boolean; immediate?: boolean }) {
  let { needLog, immediate } = options ?? {}
  if (needLog) {
    console.log(`注册${evtname}事件`);
  }
  ele.addEventListener(evtname, handler);

  if (immediate) {
    handler.call(ele)
  }
  return () => {
    if (needLog) {
      console.log(`清除${evtname}事件`);
    }
    ele.removeEventListener(evtname, handler);
  };
}

/**
 * 为元素批量设置样式、设置属性
 * @param ele html元素
 * @param styles 待批量设置的样式对象
 * @param props 待批量设置的属性对象
 */
export function setElement(ele: HTMLElement, styleObj: { [key: string]: any }, propObj?: { [key: string]: any }) {
  for (let key in styleObj) {
    ele.style.setProperty(key, styleObj[key]);
  }
  if (isObj(propObj)) {
    for (let key in propObj) {
      (ele as any)[key] = propObj[key]
    }
  }
  return ele
}