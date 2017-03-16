
/**
 * 获取render。暂时只能获取default render
 * 
 * @param {String} [name='default'] - 模板名称
 * @returns {Function}
 */
function getRender(name) {
  return require('./render/default');
}

module.exports = getRender;