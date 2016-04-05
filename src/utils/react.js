import * as T from 'babel-types';
import {find} from 'lodash';

/** Does a given function return JSX? */
function containsJSX(path) {
  if (T.isJSXElement(path)) {
    return true;
  }

  let doesContainJSX = false;

  path.traverse({
    JSXElement(jsxPath) {
      doesContainJSX = true;
      jsxPath.stop();
    }
  });

  return doesContainJSX;
}

/** Is given path a react component declaration? */
export function isReactComponent(path) {
  if (T.isClassDeclaration(path)) {
    return !!find(path.node.body.body, node => T.isClassMethod(node) && node.key.name === 'render');
  }

  if (T.isFunctionDeclaration(path)) {
    return containsJSX(path.get('body'));
  }

  if (T.isVariableDeclarator(path) && T.isFunctionExpression(path.node.init)) {
    return containsJSX(path.get('init').get('body'));
  }

  if (T.isVariableDeclarator(path) && T.isArrowFunctionExpression(path.node.init)) {
    return containsJSX(path.get('init').get('body'));
  }

  return false;
}
