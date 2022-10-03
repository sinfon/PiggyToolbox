// pages/counter/baby-counter/baby-counter.js

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
    const now = new Date()
    const todayDateStr = util.formatDate(now)
    this.refreshRecords(todayDateStr, now)
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

  getBabyDailyRecordKey(dateStr, itemEnum) {
    return 'baby-daily-record:' + dateStr + ':' + itemEnum.name
  },

  createDefaultRecordsToday() {
    const keys = Object.keys(BabyDailyRecordItemEnum)
    let records = []
    for (let key of keys) {
      const itemEnum = BabyDailyRecordItemEnum[key]
      console.log(key, itemEnum)
      let record = {
        id: key,
        name: item.name,
        open: false
      }
      records.push(record)
      this.setBabyDailyRecordToday(itemEnum, record)
    }

    return records
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
    if (record === null || record === undefined || record === "" || record.num === 0) {
      this.openMinusFailToast()
    } else {
      record.num = record.num - 1
      this.setBabyDailyRecord(dateStr, itemEnum, record)
      this.refreshRecords(dateStr)
    }
  },
  plus(e) {
    const itemEnumName = e.currentTarget.dataset.itemEnumName
    const itemEnum = BabyDailyRecordItemEnum[itemEnumName]
    const dateStr = this.data.dateStr
    let record = this.getBabyDailyRecord(dateStr, itemEnum)
    if (record === null || record === undefined || record === "" || record.num === 0) {
      record = this.createDefaultBabyDailyRecord(itemEnum)
    } 

    record.num = record.num + 1
    const now = new Date()
    let detail = {
      timeId: now.getTime(),
      timeStr: util.formatTime(now)
    }
    record.details.push(detail)

    this.setBabyDailyRecord(dateStr, itemEnum, record)
    this.refreshRecords(dateStr)
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
})