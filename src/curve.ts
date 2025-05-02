import { angleToPos } from "./math";

type GetCyclePointsOptions = {
  count?: number;//点个数，越多越精确，默认100
  degStart?: number;//起始角度,默认0
  degEnd?: number;//终止角度,默认360
  rStart: number;//起始半径
  rEnd: number;//终止半径
}

/**
 * 获取螺旋线的组成点
 * @param {object} options 选项
 * @param {number} [options.count=100] - 点个数，越多越精确，默认100
 * @param {number} [options.degStart=0] - 起始角度，默认0
 * @param {number} [options.degEnd=360] - 终止角度，默认360
 * @param {number} options.rStart - 起始半径
 * @param {number} options.rEnd - 终止半径
 * @param {object} center - 相对于此点进行螺旋
 * @param {number} center.x - x坐标
 * @param {number} center.y - y坐标
 * @returns
 */
function getHelixPoints(options: GetCyclePointsOptions, center: { x: number; y: number; }) {
  let {
    count = 100,
    degStart = 0,
    degEnd = 360,
    rStart,
    rEnd
  } = options

  let rStep = (rEnd - rStart) / (count - 1);//径向步进，负数为向内收缩，正数为向外扩展
  let degStep = (degEnd - degStart) / (count - 1)
  let ret = []
  let r = rStart, deg = degStart
  for (let index = 0; index < count; index++) {
    ret.push(angleToPos(center, deg, r))
    r += rStep
    deg += degStep
  }
  return ret
}


/**
 * 获取螺旋线的组成点,生成器
 * @param {object} options 选项
 * @param {number} [options.count=100] - 点个数，越多越精确，默认100
 * @param {number} [options.degStart=0] - 起始角度，默认0
 * @param {number} [options.degEnd=360] - 终止角度，默认360
 * @param {number} options.rStart - 起始半径
 * @param {number} options.rEnd - 终止半径
 * @param {object} center - 相对于此点进行螺旋
 * @param {number} center.x - x坐标
 * @param {number} center.y - y坐标
 * @returns
 */
function* helixPointsGenerator(options: GetCyclePointsOptions, center: { x: number; y: number; }) {
  let {
    count = 100,
    degStart = 0,
    degEnd = 360,
    rStart,
    rEnd
  } = options

  let rStep = (rEnd - rStart) / count;//径向步进，负数为向内收缩，正数为向外扩展
  let degStep = (degEnd - degStart) / count

  let r = rStart, deg = degStart
  for (let index = 0; index < count; index++) {
    yield angleToPos(center, deg, r)
    r += rStep
    deg += degStep
  }
}

export {
  getHelixPoints,
  helixPointsGenerator
}