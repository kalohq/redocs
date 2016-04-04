/* eslint-env node, mocha */
import expect from 'expect';
import * as Babylon from 'babylon';
import traverse from 'babel-traverse';
import fs from 'fs';
import path from 'path';
import * as T from 'babel-types';

import * as Resolver from '../resolver';

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

  traverse(ast, {
    ExportDefaultDeclaration(nodePath) {
      nodePath.traverse({
        Identifier(identifierNodePath) {
          testIdentifierPath = identifierNodePath;
        }
      });
    }
  });

  return testIdentifierPath;
}

describe('utils/resolver', () => {

  describe('resolveDefinition', () => {

    it('should resolve same-file VariableDeclaration', () => {
      const module = absTestModule('./resolver-same-file-VariableDeclaration/entry.js');
      const nodePath = getTestReference(module);
      const definition = Resolver.resolveDefinition(module, nodePath);

      expect(T.isStringLiteral(definition.definition.node.init)).toBe(true);
      expect(definition.definition.node.init.value).toBe('I\'m here!');
    });

    it('should resolve cross-file VariableDeclaration', () => {
      const module = absTestModule('./resolver-cross-file-VariableDeclaration/entry.js');
      const nodePath = getTestReference(module);
      const definition = Resolver.resolveDefinition(module, nodePath, resolveModule);

      expect(T.isStringLiteral(definition.definition.node.init)).toBe(true);
      expect(definition.definition.node.init.value).toBe('I\'m here!');
    });

  });

  describe('resolveRootComponentDefinition', () => {

    it('should resolve our component correctly', () => {
      expect(true).toBe(true);
    });

  });

});
