import { setElement } from './element'
import { Offset } from './typings/main'

/**
 * 为元素添加拖拽功能
 * @param el 元素选择字符串或者元素对象
 * @returns 
 */
function initDrag(el: HTMLElement | string) {
  el = (typeof el == "string" ? document.querySelector(el) : el) as unknown as HTMLElement

  let pos0: Offset,//鼠标点下时记录的位置
    last: Offset = { x: 0, y: 0 },//上次拖拽时的累积偏移量
    current: Offset = { x: 0, y: 0 };

  const move = function (e: MouseEvent) {
    current = {
      x: e.pageX - pos0.x + last.x,
      y: e.pageY - pos0.y + last.y,
    };
    setElement(el, {
      transform: `translate(${current.x}px,${current.y}px)`,
    });
  };

  const up = function (e: MouseEvent) {
    el.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    last = current;
  };

  const down = function (e: MouseEvent) {
    pos0 = {
      x: e.pageX,
      y: e.pageY,
    };

    el.addEventListener("mousemove", move);

    //监听el的mouseup事件在边界外释放时不会触发的情形
    document.addEventListener("mouseup", up);
  };

  let f1 = false;
  const enter = () => {
    if (f1) return;
    f1 = true;
    setElement(el, {
      cursor: "pointer",
    });
  };
  const leave = () => {
    if (!f1) return;
    f1 = false;
    setElement(el, {
      cursor: "initial",
    });
  };

  el.addEventListener("mousedown", down);
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);

  return {
    uninstall(reset = true) {
      if (reset) setElement(el, { transform: "" });
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    },
  };
}

export { initDrag };
