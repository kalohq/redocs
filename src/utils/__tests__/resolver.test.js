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

  const extractExportIdentifierVisitor = {
    Identifier(identifierNodePath) {
      testIdentifierPath = identifierNodePath;
    }
  };

  const defaultExportVisitor = {
    ExportDefaultDeclaration(path) {
      path.traverse(extractExportIdentifierVisitor);
    }
  };

  traverse(ast, defaultExportVisitor);

  return testIdentifierPath;
}

describe('utils/resolver', () => {

  describe('resolveDefinition', () => {

    it('should resolve same-file VariableDeclaration', () => {
      const module = absTestModule('./resolver-same-file-VariableDeclaration/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module);

      expect(T.isStringLiteral(definition.binding.path.node.init)).toBe(true);
      expect(definition.binding.path.node.init.value).toBe('I\'m here!');
    });

    it('should resolve same-file FunctionDeclaration', () => {
      const module = absTestModule('./resolver-same-file-FunctionDeclaration/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module);

      expect(T.isFunctionDeclaration(definition.binding.path.node)).toBe(true);
      expect(definition.binding.path.node.params[0].name).toBe('firstParam');
    });

    it('should resolve cross-file VariableDeclaration', () => {
      const module = absTestModule('./resolver-cross-file-VariableDeclaration/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module, resolveModule);

      expect(T.isStringLiteral(definition.binding.path.node.init)).toBe(true);
      expect(definition.binding.path.node.init.value).toBe('I\'m here!');
    });

    it('should resolve cross-file FunctionDeclaration', () => {
      const module = absTestModule('./resolver-cross-file-FunctionDeclaration/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module, resolveModule);

      expect(T.isFunctionDeclaration(definition.binding.path.node)).toBe(true);
      expect(definition.binding.path.node.params[0].name).toBe('firstParam');
    });

    it('should resolve cross-file VariableDeclaration via named imports', () => {
      const module = absTestModule('./resolver-cross-file-VariableDeclaration-named/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module, resolveModule);

      expect(T.isStringLiteral(definition.binding.path.node.init)).toBe(true);
      expect(definition.binding.path.node.init.value).toBe('I\'m here!');
    });

    it('should resolve cross-file VariableDeclaration via recursive imports', () => {
      const module = absTestModule('./resolver-cross-file-VariableDeclaration-recursive/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module, resolveModule);

      expect(T.isStringLiteral(definition.binding.path.node.init)).toBe(true);
      expect(definition.binding.path.node.init.value).toBe('I\'m here!');
    });

    it('should resolve cross-file VariableDeclaration via recursive imports with named intermediate modules', () => {
      const module = absTestModule('./resolver-cross-file-VariableDeclaration-recursive-named/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module, resolveModule);

      expect(T.isStringLiteral(definition.binding.path.node.init)).toBe(true);
      expect(definition.binding.path.node.init.value).toBe('I\'m here!');
    });

    it('should resolve cross-file VariableDeclaration via recursive imports with named default intermediate modules', () => {
      const module = absTestModule('./resolver-cross-file-VariableDeclaration-recursive-named-default/entry.js');
      const path = getTestReference(module);
      const definition = Resolver.resolveDefinition(path, module, resolveModule);

      expect(T.isStringLiteral(definition.binding.path.node.init)).toBe(true);
      expect(definition.binding.path.node.init.value).toBe('I\'m here!');
    });

  });

  describe('resolveRootComponentDefinition', () => {

    it('should resolve our component correctly', () => {
      expect(true).toBe(true);
    });

  });

});
