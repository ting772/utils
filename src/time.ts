/**
 * 获取当前时间
 * @returns [小时，分钟，秒]
 */
export function getCurrentTime() {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()];
}

/**
 * 获取当日已过去多少秒
 * @returns 
 */
export function getSecondPastToday() {
  const now = new Date();
  let t1 = now.getTime();
  now.setHours(0, 0, 0, 0);
  const diff = t1 - now.getTime();
  return ~~(diff / 1000);
}
