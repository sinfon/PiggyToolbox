require('./libs/Mixins.js');

const listeners = [];

App({
  globalData: {
    theme: 'light', // dark
    mode: '', // 模式(care：关怀模式)
  },
  changeGlobalData(data) {
    this.globalData = Object.assign({}, this.globalData, data);
    listeners.forEach((listener) => {
      listener(this.globalData);
    });
  },
  watchGlobalDataChanged(listener) {
    if (listeners.indexOf(listener) < 0) {
      listeners.push(listener);
    }
  },
  unWatchGlobalDataChanged(listener) {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  },
  onThemeChange(resp) {
    this.themeChanged(resp.theme);
  },
  themeChanged(theme) {
    wx.setStorageSync('theme', theme)
    this.changeGlobalData({
      theme: theme,
    });
  },
  onLaunch() {
    const theme = wx.getStorageSync('theme') == 'dark' ? 'dark' : 'light'
    this.themeChanged(theme)
  },
  
});
