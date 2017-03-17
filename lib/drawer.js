
function Canvas() {
  return document.createElement('canvas');
}

/**
 * 文字换行
 * 
 * @param {String} text 
 * @param {Number} maxLineWidth 
 * @param {CanvasRenderingContext2D} ctx
 * @returns {String} - 插入\n的新字符串
 */
function breakText(text, maxLineWidth, ctx) {
  let textWithBreaks = '';
  let lineWidth = 0;
  for (let i=0; i<text.length; i++) {
    const c = text[i];
    const cWidth = ctx.measureText(c).width;
    if (lineWidth + cWidth <= maxLineWidth) {
      textWithBreaks += c;
      lineWidth += cWidth;
    } else {
      textWithBreaks += '\n';
      i--;
      lineWidth = 0;
      continue;
    }
  }
  return textWithBreaks;
}

/**
 * 加载图片
 * 
 * @param {String} url 
 * @returns {Promise} - Image
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = e => reject(e);
  })
}

class RowBase {
  constructor() {
    this._align = 'left';
  }
  bounds() { throw new Error('方法未定义') }
  /**
   * 对齐方式
   * @param {String} [x] - left, center, right
   * @returns {String}
   * @memberOf RowBase
   */
  align(x) { if(x) {this._align = x} return this._align; }
  /**
   * 绘制自身
   * @param {CanvasRenderingContext2D} ctx 
   * @param {Number} originX 
   * @param {Number} originY 
   * @memberOf RowBase
   */
  draw(ctx, originX, originY) { throw new Error('方法未定义') }
}

class Row extends RowBase {}

class BlankRow extends Row {
    /**
   * Creates an instance of BlankRow.
   * 
   * @param {Object} props 
   * @param {Number} props.width
   * @param {Number} props.height
   * @param {String} [props.background='transparent']
   * @param {String} [props.rowAlign='left']
   * @memberOf BlankRow
   */
  constructor(props) {
    super();
    const defaultProps = {
      background: 'transparent',
      rowAlign: 'left'
    };
    props = Object.assign({}, defaultProps, props);
    this._width = props.width;
    this._height = props.height;
    this._background = props.background;
    this._align = props.rowAlign;
  }
  bounds() {
    return {
      width: this._width,
      height: this._height
    }
  }
  draw(ctx, originX, originY) {
    const {width: selfWidth, height: selfHeight} = this.bounds();
    // 填充背景
    ctx.fillStyle = this._background;
    ctx.fillRect(originX, originY, selfWidth, selfHeight);
  }
}

class TextRow extends Row {
  /**
   * Creates an instance of TextRow.
   * min-height == fontSize
   * 
   * @param {String} text 
   * @param {Object} props 
   * @param {Number} props.width
   * @param {Number} [props.fontSize=16]
   * @param {String} [props.fontFamliy='sans-serif']
   * @param {String} [props.fontColor='#000']
   * @param {String} [props.fontAlign='left']
   * @param {Number} [props.lineHeight=1] - times
   * @param {String} [props.background='transparent']
   * @param {Array}  [props.padding=[0, 0, 0, 0]]
   * @param {String} [props.rowAlign='left']
   * @memberOf TextRow
   */
  constructor(text, props) {
    super();
    const defaultProps = {
      fontSize: 16,
      fontFamliy: 'sans-serif',
      fontColor: '#000',
      fontAlign: 'left',
      lineHeight: 1,
      background: 'transparent',
      padding: [0, 0, 0, 0],
      rowAlign: 'left'
    };
    props = Object.assign({}, defaultProps, props);
    this._text = text;
    this._width = props.width;
    this._fontSize = props.fontSize;
    this._fontFamliy = props._fontFamliy;
    this._fontColor = props.fontColor;
    this._fontAlign = props.fontAlign;
    this._lineHeightPx = props.lineHeight * props.fontSize;
    this._background = props.background;
    this._padding = props.padding;
    this._align = props.rowAlign;
    // break lines
    this._tempCtx = (new Canvas()).getContext('2d');
    this._tempCtx.font = `${this._fontSize}px ${this._fontFamliy}`;
    const [pt, pr, pb, pl] = this._padding;
    this._textLines = breakText(text, this._width - pr - pl, this._tempCtx).split('\n');
  }
  bounds() {
    const [pt, pr, pb, pl] = this._padding;
    return {
      width: this._width,
      height: this._textLines.length * this._lineHeightPx + pt + pb,
    }
  }
  draw(ctx, originX, originY) {
    const {width: selfWidth, height: selfHeight} = this.bounds();
    const [pt, pr, pb, pl] = this._padding;
    const lineHeight = this._lineHeightPx;
    const halfLineHeight = lineHeight / 2;
    // 填充背景
    ctx.fillStyle = this._background;
    ctx.fillRect(originX, originY, selfWidth, selfHeight);
    // 打印文字
    ctx.font = `${this._fontSize}px ${this._fontFamliy}`;
    ctx.fillStyle = this._fontColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = this._fontAlign;
    if (this._fontAlign == 'right') {
      this._textLines.forEach((line, index) => {
        ctx.fillText(line, originX-pl + this._width, originY+halfLineHeight+pt+index*lineHeight )
      })
    }
    else if (this._fontAlign == 'center') {
      this._textLines.forEach((line, index) => {
        ctx.fillText(line, originX+this._width/2, originY+halfLineHeight+pt+index*lineHeight )
      })
    }
    else {
      this._textLines.forEach((line, index) => {
        ctx.fillText(line, originX+pl, originY+halfLineHeight+pt+index*lineHeight )
      })
    }
  }
}

class ImgRow extends Row {
  /**
   * Creates an instance of ImgRow.
   * @param {CanvasImage} imgIns
   * @param {Object} props 
   * @param {Object} props.width
   * @param {Array} [props.padding=[0, 0, 0, 0]]
   * @param {String} [props.rowAlign='left']
   * @memberOf ImgRow
   */
  constructor(imgIns, props) {
    super();
    const defaultProps = {
      rowAlign: 'left',
      padding: [0,0,0,0]
    };
    props = Object.assign({}, defaultProps, props);
    this._imgIns = imgIns;
    this._width = props.width;
    this._padding = props.padding;
    this._align = props.rowAlign;
  }
  getNormalizedImgSize(width) {
    const imgWidth = width || this._width;
    return {
      width: imgWidth,
      height: this._imgIns.height * (width / this._imgIns.width)
    }
  }
  bounds() {
    const [pt, pr, pb, pl] = this._padding;
    const {width, height} = this.getNormalizedImgSize(this._width - pr - pl);
    return {
      width: this._width,
      height: height + pt + pb
    }
  }
  draw(ctx, originX, originY) {
    const [pt, pr, pb, pl] = this._padding;
    const {width, height} = this.bounds();
    ctx.drawImage(this._imgIns, originX + pl, originY + pt, width - pl - pr, height - pt - pb);
  }
}

class Drawer {
  /**
   * Creates an instance of Drawer.
   * @param {Object} props
   * @param {Number} props.width 
   * @param {Number} [props.dpi=1] 
   * @param {String} [props.background='#FFFCF7'] 
   * @memberOf Drawer
   */
  constructor(props) {
    const defaultProps = {
      dpi: 1,
      background: '#FFFCF7'
    };
    props = Object.assign({}, defaultProps, props);
    this._width = props.width;
    this._height = 0;
    this._background = props.background;
    this._dpi = props.dpi,
    this._rowList = [];
    this._canvas = new Canvas();
  }
  appendRow(row) {
    this._rowList.push({row, x: 0, y: 0});
    return this;
  }
  compose() {
    let globalY = 0;
    this._rowList = this._rowList.map(item => {
      const { width, height } = item.row.bounds();
      const align = item.row.align();
      let itemX = 0;
      let itemY = globalY;
      globalY += height;
      if (align === 'left') itemX = 0;
      else if (align === 'center') itemX = (this._width - width) / 2;
      else if (align === 'right') itemX = this._width - width;
      return {
        row: item.row,
        x: itemX,
        y: itemY
      }
    })
    this._height = globalY;
    return this;
  }
  draw() {
    this._canvas.height = this._height * this._dpi;
    this._canvas.width = this._width * this._dpi;
    const ctx = this._canvas.getContext('2d');
    ctx.scale(this._dpi, this._dpi);
    // 填充背景
    ctx.fillStyle = this._background;
    ctx.fillRect(0, 0, this._width, this._height);
    this._rowList.forEach(item => {
      item.row.draw(ctx, item.x, item.y);
    });
    return this;
  }
  toDataURL() {
    return this.draw()._canvas.toDataURL();
  }
}

module.exports = {
  loadImage,
  Row,
  BlankRow,
  TextRow,
  ImgRow,
  Drawer,
}