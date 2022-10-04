Page({
  mixins: [require('../../mixin/common')],
  data: {
    inputShowed: false,
    inputVal: '',
    list: [
      // {
      //   id: 'numerology',
      //   name: '命理',
      //   open: false,
      //   pages: [{
      //     name: '生辰八字',
      //     path: '/pages/numerology/birth/birth',
      //   }],
      // },
      // {
      //   id: 'timer',
      //   name: '计时器',
      //   open: false,
      //   pages: [{
      //     name: '宝宝计时器',
      //     path: '/pages/timer/baby-timer/baby-timer',
      //   }],
      // },
      {
        id: 'counter',
        name: '计数器',
        open: false,
        pages: [{
          name: '宝宝计数器',
          path: '/pages/counter/baby-counter/baby-counter',
        }],
      },
    ],
  },
  kindToggle(e) {
    const {
      id
    } = e.currentTarget;
    const {
      list
    } = this.data;
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData({
      list,
    });
  },
  changeTheme() {
    getApp().themeChanged(this.data.theme === 'light' ? 'dark' : 'light');
  },

  // 搜索框
  showInput() {
    this.setData({
      inputShowed: true,
    });
  },
  hideInput() {
    this.setData({
      inputVal: '',
      inputShowed: false,
    });
  },
  clearInput() {
    this.setData({
      inputVal: '',
    });
  },
  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value,
    });
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
});