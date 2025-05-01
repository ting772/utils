import type { Pos, Cycle, PosOffset } from './typings/main'

/**
 * 设定上下限，如果数字在区域中，返回数字，超出则返回边界值
 * @param {number} v - 待比较的数字
 * @param {number} min - 下限
 * @param {number} max - 上限
 * @returns {number}
 */
export function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(min, v), max);
}

/**
 * 一堆数字取绝对值，返回最大的绝对值
 * @param {...number} args - 待比较的一堆数字
 * @returns {number}
 */
export function maxAbs(...args: number[]) {
  return Math.max(...args.map((v) => Math.abs(v)));
}

/**
 * 比较两数绝对值的差值是否在某个阈值之内
 * @param {number} v - 待比较数值v1 
 * @param {number} targetV - 待比较数值v2 
 * @param {number} threshold - 阈值
 * @returns {noolean} v和targetV差值的绝对值在阈值内返回true，否则返回false
 */
export function looseEqual(v: number, targetV: number, threshold = 0.01) {
  return Math.abs(v - targetV) <= threshold;
}

/**
 * 获取pos1到pos2的距离
 * @param {Pos} pos1 - 二维点pos1
 * @param {Pos} pos2 - 二维点pos2
 * @returns {number} 两点距离
 */
export function distance(pos1: Pos, pos2: Pos) {
  return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
}

enum AlignType {
  round = 0,
  floor = 1,
  ceil = 2,
}
/**
 * 将某个数value对齐到另外一个数targetV的正数倍
 * @param {number} value - 待对齐的数字
 * @param {number} targetV - 被对齐的数字
 * @param {AlignType} [type=0] - 对齐的方法 0:四舍五入 1:向下取整 2:向上取整
 * @returns {number} 返回对齐后的值
 */
export function alignValue(value: number, targetV: number, type?: AlignType) {
  type = type || AlignType.round
  let method = (['round', 'floor', 'ceil'] as const)[type]
  return Math[method](value / targetV) * targetV;
}

/**
 * 角度转弧度
 * @param {number} angle - 角度
 * @returns {number} 弧度
 */
export function toRad(angle: number) {
  return (Math.PI * 2 * angle) / 360;
}

/**
 * 弧度转角度
 * @param {number} rad - 弧度
 * @returns {number} 角度
 */
export function toAngle(rad: number) {
  return (rad / Math.PI) * 180;
}

/**
 * 计算两点和水平线的夹角
 * @param {Pos} from - 点1
 * @param {Pos} to - 点2
 * @returns {number} 夹角
 */
export function getAngle(from: Pos, to: Pos) {
  let dy = to.y - from.y;
  let dx = to.x - from.x;
  return toAngle(Math.atan2(dy, dx));
}

/**
 * 以起始点半径r，转动angle角度，得到一点并返回
 * @param {Pos} from - 起始点
 * @param {number} angle - 转动角度
 * @param {number} r - 半径
 * @returns {{x:number,y:number}} 返回得到的新点
 */
export function angleToPos(from: Pos, angle: number, r: number) {
  let rad = toRad(angle);
  let dx = Math.cos(rad) * r;
  let dy = Math.sin(rad) * r;
  return {
    x: from.x + dx,
    y: from.y + dy,
  };
}

/**
 * 判断一点是否在圆内
 * @param {Pos} center - 圆心
 * @param {number} r - 圆的半径
 * @param {Pos} pos - 待判断的点
 * @returns {boolean} 点在园内返回true，否则返回false
 */
export function isPointInCycle(center: Pos, r: number, pos: Pos) {
  return (pos.x - center.x) ** 2 + (pos.y - center.y) ** 2 <= r ** 2;
}

/**
 * 点是否在矩形内
 * @param {Pos} pt - 点
 * @param {number} x - 矩形左上角x
 * @param {number} y - 矩形左上角y
 * @param {number} w - 矩形宽度
 * @param {number} h - 矩形高度
 * @returns {boolean} 点在矩形内返回true，不在返回false
 */
export function isPointInRect(pt: Pos, x: number, y: number, w: number, h: number) {
  return pt.x >= x && pt.x <= x + w && pt.y >= y && pt.y <= y + h;
}

/**
 * 判断cycle1是否包含cycle2
 * @param {Cycle} cycle1 - 圆1
 * @param {Cycle} cycle2 - 圆2
 * @returns {boolean} cycle1包含cycle2返回true，否则返回false
 */
export function isCycleInclude(cycle1: Cycle, cycle2: Cycle) {
  return distance(cycle1, cycle2) <= cycle1.r - cycle2.r;
}

/**
 * 计算两点偏移
 * @param {Pos} from - 起始点
 * @param {Pos} to - 终点
 * @returns {{dx:number,dy:number}} 偏移对象
 */
export function ptOffset(from: Pos, to: Pos) {
  return {
    dx: to.x - from.x,
    dy: to.y - from.y,
  };
}

/**
 * 给予坐标点和偏移对象，计算后并更新输入的坐标点
 * @param {Pos} pt - 坐标点
 * @param {{dx:number,dy:number}} offset 偏移对象
 * @returns {void}
 */
export function movePt(pt: Pos, offset: PosOffset) {
  pt.x += offset.dx;
  pt.y += offset.dy;
}

/**
 * 给予起始点和偏移对象，计算后并返回新的坐标点
 * @param {Pos} pt - 坐标点
 * @param {{dx:number,dy:number}} offset - 偏移对象
 * @returns {Pos} 新的坐标点
 */
export function getMovePt(pt: Pos, offset: PosOffset) {
  let ret = { x: pt.x, y: pt.y };
  movePt(ret, offset);
  return ret;
}

/**
 * 判断一个数字是否超出了界限
 * @param value 被判断的数
 * @param min 下限
 * @param max 上限
 * @returns {boolean} 不在上下限内返回true，否则返回false
 */
export function outBounds(value: number, min: number, max: number) {
  return value < min || value > max
}

/**
 * 从给定点pos，沿着direction向量指定的方向，移动length
 * @param pos - 初始点
 * @param direction - 移动方向向量
 * @param length - 沿方向移动的长度
 * @returns {{x:number;y:number}} 移动后的点
 */
export function movePtWithDirection(pos: { x: number; y: number; }, direction: { dx: number; dy: number }, length: number) {
  const { dx, dy } = direction
  const len = Math.sqrt(dx ** 2 + dy ** 2)
  return {
    x: pos.x + (dx * length / len),
    y: pos.y + (dy * length / len)
  }
}
