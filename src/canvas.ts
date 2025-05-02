import { getAngle, maxAbs } from './math'
import { arrLast, omit } from './misc'
import { setElement } from './element'
import type { Pos, CanvasCtxOptions } from './typings/main'
import { isObj } from './isType'

/**
 * 画线或者画多线段
 * @param ctx canvas ctx实例
 * @param options ctx配置对象
 * @param showAngle 是否展示水平转动角度
 * @returns
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  options?: CanvasCtxOptions,
  showAngle?: boolean
) {
  return function (...pts: Pos[]) {
    ctx.save()
    ctx.beginPath()
    Object.assign(ctx, options)
    let [from, ...others] = pts
    ctx.moveTo(from.x, from.y)
    for (let to of others) {
      ctx.lineTo(to.x, to.y)
    }
    if (showAngle) {
      let t = arrLast(others) as Pos
      ctx.font = options?.font ?? '30px aria'
      ctx.fillText(getAngle(from, t).toFixed(1), t.x, t.y)
    }
    ctx.stroke()
    ctx.restore()
  }
}

/**
 * canvas画文字
 * @param ctx canvas ctx实例
 * @param text 文字
 * @param pos 位置
 * @param options ctx配置对象
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  pos: Pos,
  options?: CanvasCtxOptions
) {
  ctx.save()
  Object.assign(ctx, options)
  ctx.fillText(text, pos.x, pos.y)
  ctx.restore()
}

/**
 * canvas画矩形
 * @param ctx canvas ctx实例
 * @param x 矩形左上角x
 * @param y 矩形左上角y
 * @param w 矩形宽度
 * @param h 矩形高度
 * @param options ctx配置对象
 * @param dashed （虚线段参数） ctx.setLineDash方法调用参数
 */
export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options?: CanvasCtxOptions,
  dashed?: number[]
) {
  ctx.save()
  Object.assign(ctx, options)
  if (dashed) {
    ctx.setLineDash(dashed)
  }

  if (options?.strokeStyle) {
    ctx.strokeRect(x, y, w, h)
  }
  if (options?.fillStyle) {
    ctx.fillRect(x, y, w, h)
  }
  ctx.restore()
}

/**
 * canvas画圆
 * @param ctx canvas ctx实例
 * @param x 圆心x
 * @param y 圆心y
 * @param r 圆半径
 * @param options ctx配置对象
 */
export function drawCycle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  options?: CanvasCtxOptions
) {
  ctx.save()
  Object.assign(ctx, options)
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  if (options?.fillStyle) {
    ctx.fill()
  }
  if (options?.strokeStyle) {
    ctx.stroke()
  }
  ctx.restore()
}

type GridOptions = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number //网格宽度
  height: number //网格高度
  gridSize: number //网格单元尺寸
  lineWidth: number //网格线宽度
  gridLineColor: string //网格线颜色
}

/**
 * 画网格
 * @param options
 */
export function setupGrid(options: GridOptions) {
  let { canvas, ctx, width, height, gridSize, lineWidth, gridLineColor } =
    options

  canvas.width = width
  canvas.height = height

  for (let x = 0; x <= width; x += gridSize) {
    drawLine(ctx, {
      lineWidth: lineWidth,
      strokeStyle: gridLineColor,
    })({ x, y: 0 }, { x, y: height })
  }

  for (let y = 0; y <= height; y += gridSize) {
    drawLine(ctx, {
      lineWidth: lineWidth,
      strokeStyle: gridLineColor,
    })({ x: 0, y }, { x: width, y })
  }
}

export type CoordOptions = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number //canvas宽度
  height: number //canvas高度
  canvasPropsObj?: object //需要批量设置的canvas元素style属性
  axis?: {
    domain?: [number, number] //x轴取值范围
    range?: [number, number] //y轴取值范围
    styleOptions?: CanvasCtxOptions
    xSize?: number //坐标系X轴宽度
    ySize?: number //坐标系Y轴高度
  } //x，y轴配置对象
}

export type FnDrawOptions = {
  rate?: number //采样率
  style?: CanvasCtxOptions //曲线样式
  label?:
  | string
  | ({
    name: string
    pos?: {
      x: number
      y: number
    }
  } & CanvasCtxOptions)
}
/**
 * 画二维笛卡尔坐标系
 * @param options
 * @returns
 */
export function setupCoord(options: CoordOptions) {
  let { canvas, ctx, width: w, height: h, axis, canvasPropsObj } = options

  canvas.width = w
  canvas.height = h
  setElement(canvas, canvasPropsObj ?? { 'background-color': '#000' })

  axis = Object.assign(
    {
      styleOptions: {
        strokeStyle: '#fff',
      },
      domain: [-5, 5],
      range: [-5, 5],
      xSize: w,
      ySize: h,
    },
    axis
  )

  const drawAxis = drawLine(ctx, axis.styleOptions)

  let { xSize, ySize, domain, range } = axis as Required<typeof axis>

  //以canvas中心(w/2,h/w)为坐标系中心
  let x1 = (w - xSize) / 2,
    x2 = (w + xSize) / 2
  let y1 = (h + ySize) / 2,
    y2 = (h - ySize) / 2

  //取定义域[a,b]中绝对值最大的为x轴尺寸基准，当a,b不以0为中心对称时
  let xMaxAbs = maxAbs(...domain)
  const xScale = (x: number) =>
    x1 + ((x2 - x1) * (x + xMaxAbs)) / (2 * xMaxAbs)

  //取定义域[a,b]中绝对值最大的为y轴尺寸基准，当a,b不以0为中心对称时
  let yMaxAbs = maxAbs(...range)
  const yScale = (y: number) =>
    y1 + ((y2 - y1) * (y + yMaxAbs)) / (2 * yMaxAbs)

  function setup() {
    drawAxis({ x: x1, y: h / 2 }, { x: x2, y: h / 2 })
    drawAxis({ x: w / 2, y: y1 }, { x: w / 2, y: y2 })
  }

  const defaultLabelStyles = {
    fillStyle: 'red',
    font: '20px aria',
  }
  /**
   *  坐标轴上画函数曲线
   * @param fx 一元函数
   * @param rate x轴采样率
   */
  function draw(fx: (x: number) => number, options?: FnDrawOptions) {
    let pts = [] as Pos[]
    let {
      rate = 1000,
      style = { strokeStyle: 'red' },
      label,
    } = options ?? {}
    const drawCurve = drawLine(ctx, style)
    let labelPos: Pos & {
      ptx: number //canvas坐标系x
      pty: number //canvas坐标系y
    }
    for (let i = 0; i <= rate; i++) {
      let x = -xMaxAbs + (i * (xMaxAbs * 2)) / rate // 定义域x
      let ptx = xScale(x) //canvas坐标系x
      let y = fx(x) //求值域中y
      let pty = yScale(y) //值域y转canvas坐标系y
      if (isNaN(y)) {
        console.warn(fx, '出现NaN')
        continue
      }
      pts.push({
        x: ptx,
        y: pty,
      })

      if (!label) continue
      if (!labelPos! || labelPos.y < y) {
        labelPos = {
          x,
          y,
          ptx,
          pty,
        }
      }
    }
    drawCurve(...pts)
    if (label) {
      if (typeof label == 'string') {
        drawText(
          ctx,
          label,
          { x: labelPos!.ptx, y: labelPos!.pty },
          defaultLabelStyles
        )
      } else if (typeof label == 'object') {
        drawText(
          ctx,
          label.name,
          label.pos ?? { x: labelPos!.ptx, y: labelPos!.pty },
          { ...defaultLabelStyles, ...omit(label, ['name', 'pos']) }
        )
      }
    }
  }
  return {
    setup,
    draw,
  }
}

type CreateFixedCanvasOptions = {
  w: number //canvas宽度
  h: number //canvas高度
  props: { [key: string]: any } //canva样式
}
/**
 * 创建调试用的悬浮canvas
 * @param param0
 * @returns
 */
export function fixedCanvas({ w, h, props }: CreateFixedCanvasOptions) {
  let canvas = document.createElement('canvas')
  let styles = {
    position: 'fixed',
    top: 0,
    right: 0,
    'background-color': '#000',
    ...props,
  }

  setElement(canvas, styles, {
    width: w,
    height: h,
  })

  let ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)
  return {
    unistall() {
      document.body.removeChild(canvas)
    },
    render(
      draw: (
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
      ) => void
    ) {
      draw(ctx!, canvas)
    },
  }
}

/**
 * 画螺旋线
 * @param ctx canvas context2d对象
 * @param points 螺旋线点数组
 * @param param 参数对象
 * @param { (index: number, total: number) => object|void } [param.onSegmentStyle] 计算每段的样式对象并返回
 * @returns
 */
export function drawHelixCurve(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  param?: {
    onSegmentStyle?: (index: number, total: number) => object | void //段样式
  }
) {
  ctx.save()
  if (points.length < 2) return
  let [start, ...others] = points
  ctx.moveTo(start.x, start.y)
  if (!param?.onSegmentStyle) {
    ctx.beginPath()
    for (let pt of others) {
      ctx.lineTo(pt.x, pt.y)
    }
    ctx.stroke()
  } else {
    let index = 0,
      total = others.length
    ctx.beginPath()
    for (let pt of others) {
      let styleObj = param.onSegmentStyle(index, total)
      Object.assign(ctx, isObj(styleObj) ? styleObj : undefined)
      ctx.lineTo(pt.x, pt.y)
      ctx.stroke()
      index++
      if (index >= total) break
      ctx.beginPath()
      ctx.moveTo(pt.x, pt.y)
    }
  }
  ctx.restore()
}
