// pages/counter/baby-counter/baby-counter.js
import DateTimePicker from "../../../utils/date-time-picker.js"

const util = require('../../../utils/util.js')
const BabyDailyRecordItemEnum = require("../../../js/model/baby-counter/baby-daily-record-item-enum").BabyDailyRecordItemEnum

Page({
  mixins: [require('../../../mixin/common')],
  /**
   * 页面的初始数据
   */
  data: {
    minusFailToast: false,
    hideMinusFailToast: false,
    records: [],
    dateStr: "",
  },

  openMinusFailToast() {
    this.setData({
      minusFailToast: true,
    });
    setTimeout(() => {
      this.setData({
        hideMinusFailToast: true,
      });
      setTimeout(() => {
        this.setData({
          minusFailToast: false,
          hideMinusFailToast: false,
        });
      }, 300);
    }, 3000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadDateTimePicker()

    const now = new Date()
    const todayDateStr = util.formatDate(now)
    this.refreshRecords(todayDateStr, now)
  },

  loadDateTimePicker() {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = DateTimePicker.dateTimePicker();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
  },

  onDateTimeColumnChange(e) {
    console.log(e.detail)
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    // Picker 的第 e.detail.column 列发生了变更，变更为了对应列的第 e.detail.value 个元素
    arr[e.detail.column] = e.detail.value;
    // 月份变动时，对应的日期范围需要重载！
    dateArr[2] = DateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },

  refreshRecords(dateStr, date) {
    const records = this.getBabyDailyRecords(dateStr)
    this.setData({
      date: date,
      dateStr: dateStr,
      records: records
    })
  },

  getBabyDailyRecords(dateStr) {
    const keys = Object.keys(BabyDailyRecordItemEnum)
    let records = []
    for (let key of keys) {
      const itemEnum = BabyDailyRecordItemEnum[key]
      let record = this.getBabyDailyRecord(dateStr, itemEnum)
      if (record === null || record === undefined || record == "") {
        record = this.createDefaultBabyDailyRecord(itemEnum)
      }

      records.push(record)
    }

    return records
  },

  createDefaultBabyDailyRecord(itemEnum) {
    let record = {
      itemEnumName: itemEnum.name,
      name: itemEnum.desc,
      open: false,
      num: 0,
      details: []
    }

    return record
  },

  getBabyDailyRecord(dateStr, itemEnum) {
    const key = this.getBabyDailyRecordKey(dateStr, itemEnum)
    return wx.getStorageSync(key)
  },

  setBabyDailyRecord(dateStr, itemEnum, record) {
    const key = this.getBabyDailyRecordKey(dateStr, itemEnum)
    wx.setStorageSync(key, record)
  },

  clearBabyDailyRecord(dateStr, itemEnum) {
    const key = this.getBabyDailyRecordKey(dateStr, itemEnum)
    wx.removeStorageSync(key)
  },

  getBabyDailyRecordKey(dateStr, itemEnum) {
    return 'baby-daily-record:' + dateStr + ':' + itemEnum.name
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  recordToggle(e) {
    // 开关不需要进行缓存
    const { id } = e.currentTarget;
    const records = this.getBabyDailyRecords(this.data.dateStr)
    for (let i = 0, len = records.length; i < len; ++i) {
      const itemEnumName = records[i].itemEnumName
      if (itemEnumName == id) {
        records[i].open = !records[i].open;
      } else {
        records[i].open = false;
      }
      this.setBabyDailyRecord(this.data.dateStr, BabyDailyRecordItemEnum[itemEnumName], records[i])
    }

    this.refreshRecords(this.data.dateStr)
  },
  minus(e) {
    const itemEnumName = e.currentTarget.dataset.itemEnumName
    const itemEnum = BabyDailyRecordItemEnum[itemEnumName]
    const dateStr = this.data.dateStr
    let record = this.getBabyDailyRecord(dateStr, itemEnum)
    if (record === null || record === undefined || record === "" || record.details.length === 0) {
      this.openMinusFailToast()
    } else {
      this.setBabyDailyRecord(dateStr, itemEnum, record)
      this.refreshRecords(dateStr)
    }
  },

  onDateTimeChange(e) {
    const selectedDateTime = e.detail.value
    const selectedYear = this.data.dateTimeArray[0][selectedDateTime[0]]
    const selectedMonth = this.data.dateTimeArray[1][selectedDateTime[1]]
    const selectedDate = this.data.dateTimeArray[2][selectedDateTime[2]]
    const selectedHour = this.data.dateTimeArray[3][selectedDateTime[3]]
    const selectedMinute = this.data.dateTimeArray[4][selectedDateTime[4]]
    const selectedSecond = this.data.dateTimeArray[5][selectedDateTime[5]]
    const date = new Date(selectedYear, selectedMonth - 1, selectedDate, selectedHour, selectedMinute, selectedSecond)
    console.log(e)
    const itemEnumName = e.currentTarget.dataset.itemEnumName
    this.plus(date, itemEnumName)
  },
  plus(date, itemEnumName) {
    const itemEnum = BabyDailyRecordItemEnum[itemEnumName]
    const dateStr = util.formatDate(date)
    let record = this.getBabyDailyRecord(dateStr, itemEnum)
    if (record === null || record === undefined || record === "") {
      record = this.createDefaultBabyDailyRecord(itemEnum)
    } 

    let detail = {
      timeId: date.getTime(),
      timeStr: util.formatTime(date)
    }
    record.details.push(detail)

    this.setBabyDailyRecord(dateStr, itemEnum, record)
    this.refreshRecords(dateStr, date)
  },
  loadPrevDayRecords() {
    const currentDate = this.data.date
    const prevDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
    const prevDateStr = util.formatDate(prevDate)
    this.refreshRecords(prevDateStr, prevDate)
  },

  loadNextDayRecords() {
    const currentDate = this.data.date
    const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
    const nextDateStr = util.formatDate(nextDate)
    this.refreshRecords(nextDateStr, nextDate)
  },

  clearRecords4SelectedDay() {
    const dateStr = this.data.dateStr
    wx.showModal({
      title: "清除记录",
      content: "确定清除 " + dateStr + " 的记录？\n这些记录将永久删除！",
      cancelColor: 'cancelColor',
      success: res => {
        if (res.cancel) {
          return
        }
        
        const keys = Object.keys(BabyDailyRecordItemEnum)
        for (let key of keys) {
          const itemEnum = BabyDailyRecordItemEnum[key]
          this.clearBabyDailyRecord(dateStr, itemEnum)
        }

        this.refreshRecords(dateStr)
      }
    })
  },
})