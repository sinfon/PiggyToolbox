import solarLunar from '../../../components/lunar-date-picker/solar-lunar';

Page({
  mixins: [require('../../../mixin/common')],
  /**
   * 页面的初始数据
   */
  data: {
    dateStr: '',
    date: '',
    hour: '',
    showResult: false,
    result: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  showDatePicker(event) {
    const that = this
    that.setData({
      showResult: false
    })

    const date = that.data.date
    const hour = that.data.hour
    // 获取日期组件对象实例，并初始化配置
    that.selectComponent("#lunar-date-picker").init({
      date: date,
      hour: hour,
      lunar: false
    });
  },

  confirmDateSelected(event) {
    let json = {};
    json['date'] = event.detail.year + '-' + event.detail.month + '-' + event.detail.day;
    json['hour'] = event.detail.hour;
    json['dateStr'] = event.detail.thisStr;
    json['dateInfo'] = event.detail.dateInfo
    // 更新数据
    this.setData(json);
  },

  calculateHoroscope(e) {
    const that = this
    const date = that.data.date
    const hour = that.data.hour
    if (date === undefined || date === '' || hour === undefined || hour === '') {
      wx.showModal({
        content: '请先选择日期',
        showCancel: false,
      })
      return
    }

    const dateInfo = that.data.dateInfo
    that.setData({
      showResult: true,
      result: dateInfo,
    })
  },
})