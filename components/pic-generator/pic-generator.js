// components/pic-generator/pic-generator.js
const app = getApp()
const PIC_WIDTH_RATIO = 0.888

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dateStr: {
      type: String,
      value: ''
    },
    recordsJson: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgImgPath: '/images/bg.jpg',
    mpQrCodePath: '/images/share/mp-qr-code.jpg',
    pixelRatio: 2,
    userHeadUrl: '',
    count: 0,
    spinning: false,

    /**
     * 是否重新加载图片
     */
    loadingFlag: false,
    tableRows: []
  },

  // 在组件完全初始化完毕、进入页面节点树后
  attached() {
    // 延迟操作到下一个时间片执行，否则获取不到 properties 对应的属性
    wx.nextTick(() => {
      // 初始化表格数据，需要在画图前执行
      this.initBaseTableInfo();

      // 获取小程序码和头像的临时文件 & 画图
      if (!this.data.loadingFlag) {
        this.initData()
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initBaseTableInfo() {
      const that = this;
      let tableRows = [{
        name: '日期',
        value: that.properties.dateStr,
        desc: ''
      }];

      const records = JSON.parse(that.properties.recordsJson)
      records.forEach(record => {
        const details = record.details
        const times = details == undefined ? 0 : details.length
        tableRows.push({
          name: record.name,
          value: times + ' 次',
          desc: ''
        })

        if (details != undefined && details.length > 0) {
          details.forEach(detail => {
            tableRows.push({
              name: '',
              value: detail.timeStr,
              desc: detail.note === undefined ? '' : detail.note,
            })
          })
        }
      })

      that.setData({
        tableRows: tableRows
      })
    },

    // 初始化数据
    initData() {
      let that = this
      that.setData({
        spinning: true
      })

      // 获取设备宽度，计算canvas宽高
      wx.getSystemInfo({
        success: function (res) {
          let canvasW = Math.round(res.screenWidth * 0.888)
          let tableW = canvasW * 0.9;

          const myCanvasContext = wx.createCanvasContext('myCanvas', that)
          const thatTableRows = that.data.tableRows;
          const tableFontSize = 10;
          that.updateTableRowCellH(thatTableRows, myCanvasContext, tableW - tableW / 5 * 3 - tableW / 20, tableFontSize);
          const tableH = that.getTableH(thatTableRows);
          let canvasH = tableH + 200;

          that.setData({
            /**
             * 图片像素比
             */
            pixelRatio: res.pixelRatio,
            canvasW,
            canvasH,
            tableW,
            tableH,
            tableFontSize,
            myCanvasContext,

            /**
             * 更新一下新的表数据
             */
            thatTableRows
          })

          // 画表
          that.writeCanvas()
        }
      })
    },

    writeCanvas() {
      let that = this
      const ctx = that.data.myCanvasContext;
      let canvasW = that.data.canvasW
      let canvasH = that.data.canvasH
      let bgImgPath = that.data.bgImgPath

      // 画大背景 单位是 px 不是 rpx
      ctx.drawImage(bgImgPath, 0, 0, canvasW, canvasH)
      // 保存上下文
      ctx.save()

      // 画小程序码及宣传信息
      that.drawMpQrCode(ctx);
      // 画表格
      that.drawTable(ctx);

      ctx.draw(true, () => {
        that.setData({
          spinning: false
        })
      })
    },

    /**
     * @param {CanvasContext} ctx 
     */
    drawMpQrCode(ctx) {
      const that = this;
      // 小程序码
      const mpQrCodePath = that.data.mpQrCodePath;

      // 画圆参数 - 参数对应位置是针对 canvas 所画的图来说的的
      const x = that.data.canvasW / 2;
      const y = 52;
      const radius = 26;

      // 先画个大圆，为了能有圆环
      ctx.beginPath()
      // 画圆：前两个参数确定了圆心 （x,y） 坐标，第三个参数是圆的半径，四参数是绘图方向，默认是false，即顺时针
      ctx.arc(x, y, radius + 2, 0, Math.PI * 2, false)
      ctx.setFillStyle('#eee')
      ctx.fill()
      ctx.save()

      // 画小圆
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2, false)
      ctx.setFillStyle('#fff')
      ctx.fill()
      // 画好了圆 **剪切** 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，
      // 则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要 save 上下文的原因
      ctx.clip()

      // x = 圆心坐标.x - 半径；y = 圆心坐标.y - 半径；长/宽 = 圆直径
      ctx.drawImage(
        mpQrCodePath,
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
      )

      // 恢复画布
      ctx.restore()

      // 说明文字
      const fontSize = 12;
      ctx.setTextAlign('center')
      ctx.setFontSize(fontSize)
      ctx.setFillStyle('#fff')
      ctx.fillText("长按小程序码，让小猪手帮你干大事", x, y + radius + fontSize + 10)

      ctx.save()
    },

    drawTable(ctx) {
      const that = this;

      const tableW = that.data.tableW;
      const x = (that.data.canvasW - tableW) / 2;
      const y = 120;
      const thatTableRows = that.data.tableRows;
      const fontSize = that.data.tableFontSize;
      const tableH = that.data.tableH;
      let rect = {
        x: x,
        y: y,
        width: tableW,
        height: tableH
      }

      // 绘制边框 + 背景
      that.drawRoundedRect(rect, 3, ctx)

      // 绘制横线
      ctx.beginPath()
      ctx.setLineDash([3, 3]);
      let nextLineY = y;
      // 只需要在框内画线即可
      const lineNum = thatTableRows.length - 1;
      for (let i = 0; i < lineNum; i++) {
        nextLineY = nextLineY + thatTableRows[i].cellH;
        ctx.moveTo(x, nextLineY);
        ctx.lineTo(x + tableW, nextLineY);
      }

      ctx.strokeStyle = "#07c160"
      ctx.stroke();
      // 保存上下文，不然上面就白画了
      ctx.save()

      // 绘制竖线
      ctx.beginPath()
      // 切换为画实线
      ctx.setLineDash([]);

      // 第一条竖线
      ctx.moveTo(x + tableW / 5, y);
      ctx.lineTo(x + tableW / 5, y + tableH);
      ctx.strokeStyle = "#07c160"
      ctx.stroke();

      // 第二条竖线
      ctx.moveTo(x + tableW / 5 * 3, y);
      ctx.lineTo(x + tableW / 5 * 3, y + tableH);
      ctx.strokeStyle = "#07c160"
      ctx.stroke();

      ctx.save()

      // 书写文字
      let nextTextY = y;
      const paddingTop = 20;
      for (let i = 0; i < thatTableRows.length; i++) {
        const row = thatTableRows[i];
        that.drawText(ctx, {
          text: row.name,
          x: x + tableW / 20,
          y: nextTextY + paddingTop,
          fillStyle: '#000',
          textAlign: 'start',
          fontSize: fontSize
        })

        that.drawText(ctx, {
          text: row.value,
          x: x + tableW / 5 + tableW / 20,
          y: nextTextY + paddingTop,
          fillStyle: '#000',
          textAlign: 'start',
          fontSize: fontSize
        })

        // 写多行
        const textLineHeight = fontSize + 2;
        row.multiDesc.forEach((line, index) => {
          that.drawText(ctx, {
            text: line,
            x: x + tableW / 5 * 3 + tableW / 20,
            y: nextTextY + paddingTop + textLineHeight * index,
            fillStyle: '#000',
            textAlign: 'start',
            fontSize: fontSize
          })
        })

        nextTextY = nextTextY + row.cellH;
      }

      // 保存上下文
      ctx.save()
    },

    updateTableRowCellH(tableRows, context, textWidth, fontSize) {
      const baseCellH = 30;
      const toAddCellH = 12;
      tableRows.forEach(row => {
        const multiDesc = this.breakLinesForCanvas(context, row.desc, textWidth, fontSize);
        const lineNum = multiDesc.length > 0 ? multiDesc.length : 1;

        row.multiDesc = multiDesc;
        row.cellH = baseCellH + toAddCellH * (lineNum - 1);
      })
    },

    breakLinesForCanvas(context, text, width, fontSize) {
      const that = this;
      let result = [];
      let breakPoint = 0;
      while ((breakPoint = that.findBreakPoint(text, width, context, fontSize)) !== -1) {
        result.push(text.substr(0, breakPoint));
        text = text.substr(breakPoint);
      }

      if (text) {
        result.push(text);
      }

      return result;
    },

    /**
     * 寻找切换断点
     */
    findBreakPoint(text, width, context, fontSize) {
      let min = 0;
      let max = text.length - 1;

      while (min <= max) {
        let middle = Math.floor((min + max) / 2);
        // 需要设置，否则不知道会按照什么来计算了
        context.setFontSize(fontSize);
        let middleWidth = context.measureText(text.substr(0, middle)).width;
        let oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
          return middle;
        }
        if (middleWidth < width) {
          min = middle + 1;
        } else {
          max = middle - 1;
        }
      }

      return -1;
    },

    getTableH(tableRows) {
      let tableH = 0;
      for (const row of tableRows) {
        tableH = tableH + row.cellH
      }

      return tableH;
    },

    drawText(ctx, textInfo) {
      if (textInfo.textAlign) {
        ctx.setTextAlign(textInfo.textAlign)
      }

      if (textInfo.fontSize) {
        ctx.setFontSize(textInfo.fontSize)
      }

      if (textInfo.fillStyle) {
        ctx.setFillStyle(textInfo.fillStyle)
      }

      ctx.fillText(textInfo.text, textInfo.x, textInfo.y)
      ctx.save();
    },

    /**
     * 绘制圆角矩形
     */
    drawRoundedRect(rect, r, ctx) {
      let that = this
      let ptA = that.point(rect.x + r, rect.y)
      let ptB = that.point(rect.x + rect.width, rect.y)
      let ptC = that.point(rect.x + rect.width, rect.y + rect.height)
      let ptD = that.point(rect.x, rect.y + rect.height)
      let ptE = that.point(rect.x, rect.y)

      ctx.beginPath()

      ctx.moveTo(ptA.x, ptA.y)
      ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
      ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
      ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
      ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)

      ctx.strokeStyle = "#fff"
      ctx.stroke()
      ctx.setFillStyle('#fff')
      ctx.fill()
      ctx.save()
    },

    point(x, y) {
      return {
        x,
        y
      }
    },

    /**
     * 保存图片
     */
    save() {
      let that = this
      wx.canvasToTempFilePath({
        x: 0, // 起点横坐标
        y: 0, // 起点纵坐标
        width: that.data.canvasW, // canvas 当前的宽
        height: that.data.canvasH, // canvas 当前的高
        destWidth: that.data.canvasW * that.data.pixelRatio, // canvas 当前的宽 * 设备像素比
        destHeight: that.data.canvasH * that.data.pixelRatio, // canvas 当前的高 * 设备像素比
        canvasId: 'myCanvas',
        success: function (res) {
          //调取小程序当中获取图片
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '图片保存成功！',
                icon: 'none'
              })
            },
            fail: function (res) {
              if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny" || res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                console.log("打开设置窗口");
                that.doAuth()
              }
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      }, this)
    },

    /**
     * 获取授权
     */
    doAuth() {
      wx.showModal({
        title: '获取授权',
        content: '您是否同意重新授权保存图片',
        cancelText: '不同意',
        confirmText: '好',
        confirmColor: '#21c0ae',
        success: function (res) {
          if (res.confirm) { // 点击确认
            wx.openSetting({
              success(settingdata) {

                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  console.log("获取权限成功，再次点击图片保存到相册")
                } else {
                  console.log("获取权限失败")
                }
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
        }
      })
    },
  }
})