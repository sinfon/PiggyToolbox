/**
 * Enum for BabyDailyRecordItem.
 * @readonly
 * @enum {{name: string}}
 */
const BabyDailyRecordItemEnum = Object.freeze({
  BREAST_MILK: {
    code: 1,
    name: "BREAST_MILK",
    desc: "母乳",
  },
  MILK_POWDER: {
    code: 2,
    name: "MILK_POWDER",
    desc: "奶粉",
  },
  SHIT: {
    code: 3,
    name: "SHIT",
    desc: "大便"
  },
  PEE: {
    code: 4,
    name: "PEE",
    desc: "小便"
  },
  BATH: {
    code: 5,
    name: "BATH",
    desc: "洗澡",
  },
  TOUCH: {
    code: 6,
    name: "TOUCH",
    desc: "抚触",
  },
  TEMPERATURE: {
    code: 7,
    name: "TEMPERATURE",
    desc: "体温",
  },
  WEIGHT: {
    code: 8,
    name: "WEIGHT",
    desc: "体重",
  },
  BW_CARD: {
    code: 9,
    name: "BW_CARD",
    desc: "黑白卡",
  }
})

module.exports = {
  BabyDailyRecordItemEnum
}

