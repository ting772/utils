import { isObj } from "./isType";
import type { RemoveReadonly } from '../typings/main'

/**
 * 将样式对象拼接成style字符串
 * @param obj 样式对象
 * @returns 
 */
export function styleStr(obj: object) {
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
export function createElement(tag: string, { claz, style }: { claz: string | string[]; style: object }, children: ChildType) {
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
 * @param needLog 是否需要开启调试打印
 * @returns 
 */
export function registEvent(ele: EventTarget, evtname: string, handler: EventListener, needLog?: boolean) {
  if (needLog) {
    console.log(`注册${evtname}事件`);
  }
  ele.addEventListener(evtname, handler);
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
export function setElement(ele: HTMLElement, styles: { [key: string]: any }, props?: { [key: string]: any }) {
  for (let key in styles) {
    ele.style.setProperty(key, styles[key]);
  }
  if (isObj(props)) {
    for (let key in props) {
      ele[key] = props[key]
    }
  }
  return ele
}