import type { Pos, Cycle, PosOffset } from '../typings/main'

/**
 * 设定上下限，如果数字在区域中，返回数字，超出则返回边界值
 * @param v 待比较的数字
 * @param min 下限
 * @param max 上限
 * @returns number
 */
export function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(min, v), max);
}

/**
 * 一堆数字取绝对值，返回最大的绝对值
 * @param args 待比较的一堆数字
 * @returns 
 */
export function maxAbs(...args: number[]) {
  return Math.max(...args.map((v) => Math.abs(v)));
}

/**
 * 比较两数绝对值的差值是否在某个阈值之内
 * @param v 
 * @param targetV 
 * @param threshold 
 * @returns 
 */
export function looseEqual(v, targetV, threshold = 0.01) {
  return Math.abs(v - targetV) <= threshold;
}

/**
 * 获取pos1到pos2的距离
 * @param pos1 二维点
 * @param pos2 二维点
 * @returns 两点距离
 */
export function distance(pos1: Pos, pos2: Pos) {
  return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2);
}

/**
 * 将某个数对齐到另外一个数的正数倍
 * @param value 
 * @param targetV 
 * @returns 返回对齐后的值
 */
export function alignValue(value: number, targetV: number) {
  return Math.round(value / targetV) * targetV;
}

/**
 * 角度转弧度
 * @param angle 角度
 * @returns 弧度
 */
export function toRad(angle: number) {
  return (Math.PI * 2 * angle) / 360;
}

/**
 * 弧度转角度
 * @param rad 弧度
 * @returns 角度
 */
export function toAngle(rad: number) {
  return (rad / Math.PI) * 180;
}

/**
 * 计算两点和水平线的夹角
 * @param from pos1
 * @param to pos2
 * @returns 夹角
 */
export function getAngle(from: Pos, to: Pos) {
  let dy = to.y - from.y;
  let dx = to.x - from.x;
  return toAngle(Math.atan2(dy, dx));
}

/**
 * 以起始点半径r，转动angle角度，得到一点并返回
 * @param from 起始点
 * @param angle 角度
 * @param r 半径
 * @returns 返回计算的新点
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
 * @param center 圆心
 * @param r 圆的半径
 * @param pos 点
 * @returns 是否在圆内
 */
export function isPointInCycle(center: Pos, r: number, pos: Pos) {
  return (pos.x - center.x) ** 2 + (pos.y - center.y) ** 2 <= r ** 2;
}

/**
 * 点是否在矩形内
 * @param pt 点
 * @param x 矩形左上角x
 * @param y 矩形左上角y
 * @param w 矩形宽度
 * @param h 矩形高度
 * @returns 是否在矩形内
 */
export function isPointInRect(pt: Pos, x: number, y: number, w: number, h: number) {
  return pt.x >= x && pt.x <= x + w && pt.y >= y && pt.y <= y + h;
}


/**
 * 判断cycle2是否被包含在cycle1中
 * @param cycle1
 * @param cycle2 
 * @returns 是否包含
 */
export function isCycleInclude(cycle1: Cycle, cycle2: Cycle) {
  return distance(cycle1, cycle2) <= cycle1.r - cycle2.r;
}

/**
 * 两点偏移
 * @param from 起始点
 * @param to 终点
 * @returns 偏移对象
 */
export function ptOffset(from: Pos, to: Pos) {
  return {
    dx: to.x - from.x,
    dy: to.y - from.y,
  };
}

/**
 * 给予坐标点和偏移对象，计算后并更新坐标点
 * @param pt 坐标点
 * @param offset 偏移对象
 * 
 */
export function movePt(pt: Pos, offset: PosOffset) {
  pt.x += offset.dx;
  pt.y += offset.dy;
}

/**
 * 给予起始点和偏移对象，计算后并返回新的坐标点
 * @param pt 坐标点
 * @param offset 偏移对象
 * @returns 新的坐标点
 */
export function getMovePt(pt: Pos, offset: PosOffset) {
  let ret = { x: pt.x, y: pt.y };
  movePt(ret, offset);
  return ret;
}