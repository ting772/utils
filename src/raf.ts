import { Cycle } from './typings/main'

/**
 * 在requestAnimationFrame中循环执行回调
 * @param cb 回调,返回false退出循环
 * @returns {()=>void} 取消动画回调
 */
export function rafLoop(cb: (time: number) => void | false) {
  let raf: number;
  function run(time: number) {
    let continueRun = cb(time);
    if (continueRun === false) {
      return
    }
    raf = requestAnimationFrame(run);
  }
  raf = requestAnimationFrame(run);
  return () => {
    cancelAnimationFrame(raf);
  };
}

/**
 * 在raf循坏中，逐步迭代初始值到目标值
 * @param currentValue 初始值
 * @param targetValue 目标值
 * @param f 迭代因子 (0,1)
 * @returns 每次迭代后的值
 */
export function iterateEaseFromTo(currentValue: number, targetValue: number, f: number) {
  return (targetValue - currentValue) * f + currentValue;
}

/**
 * 计算速度因摩擦力衰减，返回衰减后的值
 * @param v 速度，正负表示方向
 * @param friction 摩擦力因子
 * @returns 
 */
export function reduceVelocity(v: number, friction: number) {
  return v > 0
    ? Math.max(v - friction, 0)
    : -1 * Math.max(Math.abs(v) - friction, 0);
}

export enum SpeedDecayType {
  COLLISION,
  FRICTION
}

export enum CollisionSide {
  TOP,
  LEFT,
  BOTTOM,
  RIGHT
}

export enum MovingDirection {
  X,
  Y
}

export type UpdateBallVelocityInRectOptions<T extends object> = {
  wBox: [number, number];//[左侧X，右侧X]
  hBox: [number, number];//[上侧y，下侧y]
  speedDecay?: (obj: T, dir: MovingDirection, type: SpeedDecayType, side?: CollisionSide) => number
}

/**
 * 限制小球在一个巨型盒子中弹性碰撞运动
 * @param ball 球对象
 * @param wBox [左侧X，右侧X]
 * @param hBox [上侧y，下侧y]
 */
export function updateBallVelocityInRect<T extends Record<"x" | "y" | "vx" | "vy" | "r", number>>(ball: T, options: UpdateBallVelocityInRectOptions<T>) {
  let {
    wBox,
    hBox,
    speedDecay
  } = options
  let [w0, w] = wBox;
  let [h0, h] = hBox;
  if (ball.x + ball.r > w) {
    ball.x = w - ball.r;
    ball.vx *= -1;
    if (speedDecay) {
      ball.vx = speedDecay(ball, MovingDirection.X, SpeedDecayType.COLLISION, CollisionSide.RIGHT);
    }
  } else if (ball.x - ball.r < w0) {
    ball.x = ball.r + w0;
    ball.vx *= -1;
    if (speedDecay) {
      ball.vx = speedDecay(ball, MovingDirection.X, SpeedDecayType.COLLISION, CollisionSide.LEFT);
    }
  } else if (speedDecay) {
    ball.vx = speedDecay(ball, MovingDirection.X, SpeedDecayType.FRICTION);
  }

  if (ball.y + ball.r > h) {
    ball.y = h - ball.r;
    ball.vy *= -1;
    if (speedDecay) ball.vy = speedDecay(ball, MovingDirection.Y, SpeedDecayType.COLLISION, CollisionSide.BOTTOM);
  } else if (ball.y - ball.r < 0) {
    ball.y = ball.r + h0;
    ball.vy *= -1;
    if (speedDecay) ball.vy = speedDecay(ball, MovingDirection.Y, SpeedDecayType.COLLISION, CollisionSide.TOP);
  } else if (speedDecay) {
    ball.vy = speedDecay(ball, MovingDirection.Y, SpeedDecayType.FRICTION);
  }
}