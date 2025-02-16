import { Cycle } from '../typings/main'

/**
 * 在requestAnimationFrame中循环执行回调
 * @param cb 回调,返回false退出循环
 * @returns 
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

function dummy(x:any) {
  return x;
}

type UpdateBallVelocityInRectOptions = {
  wBox: [number, number];//[左侧X，右侧X]
  hBox: [number, number];//[上侧y，下侧y]
  collisionDecayX?: (speedX: number) => number;//球和x方向边界碰撞速度衰减函数
  collisionDecayY?: (speedY: number) => number;//球和y方向边界碰撞速度衰减函数
  frictionX?: (speedX: number) => number;//x方向上移动摩擦衰减函数
  frictionY?: (speedY: number) => number;//y方向上移动摩擦衰减函数
}

type MovableCycle = Cycle & {
  vx: number;
  vy: number;
}

/**
 * 限制小球在一个巨型盒子中弹性碰撞运动
 * @param ball 球对象
 * @param wBox [左侧X，右侧X]
 * @param hBox [上侧y，下侧y]
 */
export function updateBallVelocityInRect(ball: MovableCycle, options: UpdateBallVelocityInRectOptions) {
  let {
    wBox,
    hBox,
    collisionDecayX = dummy,
    collisionDecayY = dummy,
    frictionX = dummy,
    frictionY = dummy,
  } = options
  let [w0, w] = wBox;
  let [h0, h] = hBox;
  if (ball.x + ball.r > w) {
    ball.x = w - ball.r;
    ball.vx *= -1;
    ball.vx = collisionDecayX(ball.vx);
  } else if (ball.x - ball.r < w0) {
    ball.x = ball.r + w0;
    ball.vx *= -1;
    ball.vx = collisionDecayX(ball.vx);
  } else {
    ball.vx = frictionX(ball.vx);
  }

  if (ball.y + ball.r > h) {
    ball.y = h - ball.r;
    ball.vy *= -1;
    ball.vy = collisionDecayY(ball.vy);
  } else if (ball.y - ball.r < 0) {
    ball.y = ball.r + h0;
    ball.vy *= -1;
    ball.vy = collisionDecayY(ball.vy);
  } else {
    ball.vy = frictionY(ball.vy);
  }
}