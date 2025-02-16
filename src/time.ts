export function dateFormat(date: Date, fmt: string) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").slice(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).slice(("" + o[k]).length));
  }
  return fmt;
}

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
