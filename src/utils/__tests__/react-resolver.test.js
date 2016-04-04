/* eslint-env node, mocha */
import expect from 'expect';
import * as Babylon from 'babylon';
import traverse from 'babel-traverse';
import fs from 'fs';
import path from 'path';
import * as T from 'babel-types';

import * as ReactResolver from '../react-resolver';

function parseModule(moduleSource) {
  return Babylon.parse(moduleSource, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'objectRestSpread'
    ]
  });
}

function resolveModule(contextPath, modulePath) {
  const {dir} = path.parse(contextPath);
  const hasExt = /\.js$/.test(modulePath);
  const absPath = path.join(dir, modulePath + (hasExt ? '' : '.js'));
  const module = readModule(absPath);
  const ast = parseModule(module);

  return {
    ast,
    path: absPath
  };
}

function absTestModule(module) {
  // TODO: Is there a better way to resolve the source test? (problem atm is babel transpilation)
  return path.join(process.cwd(), 'src/utils/__tests__', module);
}

function readModule(modulePath) {
  return fs.readFileSync(modulePath, {encoding: 'utf8'});
}

function getTestReference(testModulePath) {
  const module = readModule(testModulePath);
  const ast = parseModule(module);

  let testIdentifierPath;

  const extractExportIdentifierVisitor = {
    Identifier(identifierNodePath) {
      testIdentifierPath = identifierNodePath;
    }
  };

  const defaultExportVisitor = {
    ExportDefaultDeclaration(nodePath) {
      nodePath.traverse(extractExportIdentifierVisitor);
    }
  };

  traverse(ast, defaultExportVisitor);

  return testIdentifierPath;
}

describe('utils/react-resolver', () => {

  describe('resolveRootComponentDefinition', () => {

    it('should resolve same-file VariableDeclaration', () => {
      const module = absTestModule('./react-resolver-same-file-VariableDeclaration/entry.js');
      const nodePath = getTestReference(module);
      const definition = ReactResolver.resolveRootComponentDefinition(nodePath, module);

      expect(T.isVariableDeclarator(definition.binding.path)).toBe(true);
      expect(T.isArrowFunctionExpression(definition.binding.path.node.init)).toBe(true);
      expect(T.isJSXElement(definition.binding.path.node.init.body)).toBe(true);
    });

    it('should resolve same-file FunctionDeclaration', () => {
      const module = absTestModule('./react-resolver-same-file-FunctionDeclaration/entry.js');
      const nodePath = getTestReference(module);
      const definition = ReactResolver.resolveRootComponentDefinition(nodePath, module);

      expect(T.isFunctionDeclaration(definition.binding.path)).toBe(true);
      expect(definition.binding.path.node.id.name).toBe('Definition');
    });

    it('should resolve same-file VariableDeclaration through a facade', () => {
      const module = absTestModule('./react-resolver-same-file-VariableDeclaration-facade/entry.js');
      const nodePath = getTestReference(module);
      const definition = ReactResolver.resolveRootComponentDefinition(nodePath, module);

      expect(T.isVariableDeclarator(definition.binding.path)).toBe(true);
      expect(T.isArrowFunctionExpression(definition.binding.path.node.init)).toBe(true);
      expect(T.isJSXElement(definition.binding.path.node.init.body)).toBe(true);
    });

  });

});
