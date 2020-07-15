const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');

module.exports = slug;

function slug() {
  return transformer;
}

function transformer(ast) {
  visit(ast, 'heading', visitor);
  function visitor(node) {
    const data = node.data || (node.data = {});
    const props = data.hProperties || (data.hProperties = {});
    const id = props.id;

    const rawHeader = id ? id : toString(node);
    data.id = rawHeader;
    props.id = rawHeader;
  }
}