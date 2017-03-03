
// js
// ---------------------------
const render = require('../../libs/render');
const Drawer = require('../../libs/drawer');

const drawer = new Drawer(render);

const defaultTpl = ['<div>',
'  <h3><%= noteData.title %></h3>',
'  <p><%= noteData.desc %></p>',
'  <% if (noteData.images) { %>',
'    <% noteData.images.forEach( function (img) { %>',
'      <div><img style="max-width: 100%" src="<%= img %>" alt="读书截图" ></div>',
'    <% }); %>',
'  <% } %>',
'  <% if (extraData) { %>',
'    <img width="100" src="<%= extraData.qr %>" alt="公众号二维码">',
'  <% } %>',
'</div>'].join("");

const defaultTpl2 = require('../../tpls/default.tpl');

const noteData = {
  title: '读书笔记',
  desc: '芝士就是力量',
  images: [
    require('./images/1.jpg'),
    require('./images/1.jpg'),
    require('./images/1.jpg'),
  ]
}

const extraData = {
  qr: require('./images/qr.jpg')
}

drawer.drawFromHTML(defaultTpl2, noteData, extraData)
  .then(result => {
    const img = new Image();
    img.src = result.imgData;
    document.querySelector('#root').appendChild(img);
  })
  .catch(err => {
    console.error(err);
    document.querySelector('#err').innerHTML = err.toString();
  })