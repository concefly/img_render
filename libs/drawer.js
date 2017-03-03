/**
 * 传入字段说明
 * 
 * noteData: 笔记相关字段
 * - title: String
 * - desc: String
 * - images: urls' array
 * 
 * extraData: 额外信息字段
 * - qr: url of the QR code
 */

const rh = require('rasterizehtml/dist/rasterizeHTML.allinone');

class Drawer {
  constructor(render) {
    this._render = render;
  }
  /**
   * 生成图片标签
   * 
   * @param {Object} tplString
   * @param {Object} noteData 
   * @param {Object} [extraData] 
   * @param {Object} [options] - rasterizeHTML选项（https://github.com/cburgmer/rasterizeHTML.js/wiki/API#optional-parameters）
   * @returns {Promise}
   */
  drawFromHTML(tpl, noteData, extraData, options) {
    const html = this._render(tpl, {noteData, extraData});
    return new Promise((resolve, reject) => {
      rh.drawHTML(html, null, options).then(result => {
        resolve({
          height: result.image.height,
          width: result.image.width,
          imgData: result.image.src
        });
        // const ca = document.createElement('canvas');
        // ca.height = result.image.height;
        // ca.width = result.image.width;
        // const ctx = ca.getContext('2d');
        // let img = new Image();
        // img.onload = function() {
        //   ctx.drawImage(img, 0, 0);
        //   const imgData = ca.toDataURL('png');
        //   // 内存回收
        //   img = null;
        //   resolve({
        //     height: result.image.height,
        //     width: result.image.width,
        //     imgData: result.image.src
        //   });
        // }
        // img.src = result.image.src;
      }, reject);
    })
  }
}

module.exports = Drawer;

