function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}

function getMonthDay(year, month) {
  // 1582年以来的置闰规则：
  // 普通闰年：公历年份是4的倍数，且不是100的倍数的，为闰年（如2004年、2020年等就是闰年）。
  // 世纪闰年：公历年份是整百数的，必须是400的倍数才是闰年（如1900年不是闰年，2000年是闰年）。
  // 1582年以前的惯例：
  // 四年一闰；如果公元A年的A（正数）能被4整除，那么它就是闰年；如果公元前B年的B（正数）除以4余1，那么它也是闰年。
  const isLeapYear = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      return getLoopArray(1, 31)
    case '04':
    case '06':
    case '09':
    case '11':
      return getLoopArray(1, 30)
    case '02':
      return isLeapYear ? getLoopArray(1, 29) : getLoopArray(1, 28)
    default:
      return '月份格式不正确，请重新输入！'
  }
}

function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());

  return [year, mont, date, hour, minu, seco];
}

function dateTimePicker(startYear, endYear, date) {
  const now = new Date()

  // 返回默认显示的数组和联动数组的声明
  var dateTime = [],
    dateTimeArray = [
      [],
      [],
      [],
      [],
      [],
      []
    ];
  var start = startYear || 1970;
  var end = endYear || now.getFullYear();
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);

  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    // 所有展示值二维数组：列 * 行
    dateTimeArray: dateTimeArray,
    // 选中值下标数组
    dateTime: dateTime
  }
}

export default {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay
}