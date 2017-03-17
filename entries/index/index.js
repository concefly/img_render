
// js
// ---------------------------

const $ = require('jquery');
const render = require('../../index')();

const payloadSimple = {
  persistDays: 3,
  note: '读书笔记 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse cupiditate quaerat rerum optio, error similique, laborum quis adipisci porro quisquam repellendus minima culpa deleniti fuga obcaecati illum ipsum quas delectus.',
  book: '金色故乡',
  author: 'Jam',
  date: '2017年3月15日',
  imgs: [
    require('./images/2.jpg'),
    require('./images/3.jpg'),
  ],
  qr: require('./images/qr.jpg'),
  brand: '下一页读书',
  slogan: '习惯读书，就是下一页'
}

const payloadMissing = {}

render(payloadSimple, {
  width: 320,
  dpi: 2
})
  .then(dataURL => {
    const img = new Image();
    img.src = dataURL;
    $('#img').append(img).append('<hr />');
  })
  .catch(e => console.error(e))


render(payloadMissing, {
  width: 320,
  dpi: 1
})
  .then(dataURL => {
    const img = new Image();
    img.src = dataURL;
    $('#img').append(img).append('<hr />');
  })
  .catch(e => console.error(e))