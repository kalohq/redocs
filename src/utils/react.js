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
export function isReactComponent(nodePath) {
  if (T.isClassDeclaration(nodePath)) {
    return !!find(nodePath.node.body.body, node => T.isClassMethod(node) && node.key.name === 'render');
  }

  if (T.isFunctionDeclaration(nodePath)) {
    return containsJSX(nodePath.get('body'));
  }

  if (T.isVariableDeclarator(nodePath) && T.isFunctionExpression(nodePath.node.init)) {
    return containsJSX(nodePath.get('init').get('body'));
  }

  if (T.isVariableDeclarator(nodePath) && T.isArrowFunctionExpression(nodePath.node.init)) {
    return containsJSX(nodePath.get('init').get('body'));
  }

  return false;
}
