/* eslint-env node, mocha */
import expect from 'expect';
import * as Babylon from 'babylon';
import traverse from 'babel-traverse';
import * as T from 'babel-types';

import * as ReactUtils from '../react';

function parse(type, code) {
  let first;

  const ast = Babylon.parse(code, {
    plugins: [
      'jsx',
      'flow',
      'objectRestSpread'
    ]
  });

  traverse(ast, {
    [type]: function find(nodePath) {
      first = nodePath;
      nodePath.stop();
    }
  });

  return first;
}

describe('utils/react', () => {

  describe('isReactComponent', () => {

    it('should give the correct answer', () => {
      const nodePathA = parse('ClassDeclaration', `class MyComponent {
        render() {}
      }`);
      expect(ReactUtils.isReactComponent(nodePathA)).toBe(true);

      const nodePathB = parse('FunctionDeclaration', `function MyComponent() {
        return <div>Test</div>;
      }`);
      expect(ReactUtils.isReactComponent(nodePathB)).toBe(true);

      const nodePathC = parse('VariableDeclarator', `const MyComponent = function() {
        return <div>Test</div>;
      }`);
      expect(ReactUtils.isReactComponent(nodePathC)).toBe(true);

      const nodePathD = parse('VariableDeclarator', `const MyComponent = () => <div>Test</div>;`);
      expect(ReactUtils.isReactComponent(nodePathD)).toBe(true);
    });

  });

});
