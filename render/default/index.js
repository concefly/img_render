const co = require('co');
const {
  loadImage,
  Row,
  BlankRow,
  TextRow,
  ImgRow,
  Drawer
} = require('../../lib/drawer');

const wingBlank = 12;
const pl = pr = 10;
const serif = 'serif';
const sansSerif = 'sans-serif';

/**
 * 返回屏幕宽度，默认320
 * 
 * @returns {number}
 */
function getScreenWidth() {
  return window.innerWidth || 320;
}

/**
 * 返回屏幕dpi，默认2
 * 
 * @returns {Number}
 */
function getDpi() {
  return window.devicePixelRatio || 2;
}

/**
 * 绘制长图
 * 
 * @param {Object} data
 * @param {String} data.book
 * @param {String} data.note
 * @param {String} data.author
 * @param {String} data.date
 * @param {String} data.persistDays
 * @param {Array} data.imgs
 * @param {String} data.qr
 * @param {String} data.brand
 * @param {String} data.slogan
 * @param {Object} opts
 * @param {Number} [opts.width=detected] - 不传入则自动检测
 * @param {Number} [opts.dpi=detected] - 不传入则自动检测
 * @returns {Promise[String]} - dataURL
 */
function render(data, opts) {
  const defaultData = {
    book: '未填写书名',
    note: '还没有笔记哦',
    author: '匿名',
    date: '',
    persistDays: 0,
    imgs: [],
    qr: '#',
    brand: '熊猫创新工作室',
    slogan: '关于美、探索和创造'
  };
  const defaultOpts = {
    width: getScreenWidth(),
    dpi: getDpi()
  };
  opts = Object.assign({}, defaultOpts, opts);
  data = Object.assign({}, defaultData, data);

  return co.wrap(function * () {
    const drawer = new Drawer({
      width: opts.width,
      dpi: opts.dpi,
      background: '#FEFDFB',
      rowAlign: 'center'
    });
    
    drawer
      .appendRow(new BlankRow({width: opts.width, height: wingBlank}))
      // 读 xx 书
      .appendRow(new TextRow(`读《${data.book}》`, {
        width: opts.width - wingBlank * 2,
        padding: [pr, pr, 15, pl],
        fontFamliy: serif,
        fontColor: '#937644',
        fontSize: 18,
        background: '#FDF7EF',
        rowAlign: 'center'
      }))
      // 坚持读书第x天
      .appendRow(new TextRow(`这是我坚持读书的第 ${data.persistDays} 天`, {
        width: opts.width - wingBlank * 2,
        padding: [0, pr, 50, pl],
        fontFamliy: serif,
        fontColor: '#937644',
        fontSize: 12,
        background: '#FDF7EF',
        rowAlign: 'center'
      }))
      // author, date
      .appendRow(new TextRow(
        `${data.author}, ${data.date}笔记`, {
          width: opts.width - wingBlank * 2,
          padding: [0, pr, 10, pl],
          fontFamliy: sansSerif,
          fontColor: '#DFD2BE',
          fontSize: 13,
          background: '#FDF7EF',
          rowAlign: 'center'
        }))
      // 读书笔记
      .appendRow(new TextRow(data.note, {
          width: opts.width - wingBlank * 2,
          padding: [20, pr, 20, pl],
          fontFamliy: sansSerif,
          fontColor: '#444444',
          fontSize: 16,
          lineHeight: 1.5,
          background: 'transparent',
          rowAlign: 'center'
        }))
    
    // 添加截图
    if (data.imgs) {
      const imgRows = yield data.imgs.map(co.wrap(function * (url, index) {
        try {
          const img = yield loadImage(url);
          return new ImgRow(img, {
            width: opts.width - wingBlank*2,
            rowAlign: 'center',
            padding: [0,0,5,0],
            rowAlign: 'center'
          })
        } catch (e) {
          console.warn(`图片${index}加载失败`);
          return null
        }
      })).filter(i => !!i);
      imgRows.forEach(imgSection => drawer.appendRow(imgSection))
    }
    
    try {
      const qrImg = yield loadImage(data.qr);
      drawer
        // 二维码
        .appendRow(new ImgRow(qrImg, {
          width: 100,
          padding: [15, pr, 10, pl],
          rowAlign: 'center'
        }))
    } catch (e) {
      console.warn('二维码加载失败')
    }
    
    drawer
      // 公司名
      .appendRow(new TextRow(data.brand, {
        width: opts.width - wingBlank*2,
        padding: [0, pr, 8, pl],
        fontFamliy: sansSerif,
        fontColor: '#937644',
        fontSize: 16,
        fontAlign: 'center',
        rowAlign: 'center'
      }))
      // slogan
      .appendRow(new TextRow(data.slogan, {
        width: opts.width - wingBlank*2,
        padding: [0, pr, 20, pl],
        fontFamliy: sansSerif,
        fontColor: '#937644',
        fontSize: 13,
        fontAlign: 'center',
        rowAlign: 'center'
      }))

    return drawer.compose().toDataURL();
  })()
}

module.exports = render;