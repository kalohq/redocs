import * as T from 'babel-types';
import traverse from 'babel-traverse';

// TODO: Will need to think hard about how to improve the apis seen here (pluggability)

/** Given a module ast get reference to the default export path */
function getDefaultExportPath(moduleAst) {
  let identifierPath;

  traverse(moduleAst, {
    ExportDefaultDeclaration(nodePath) {
      nodePath.traverse({
        Identifier(identifierNodePath) {
          identifierPath = identifierNodePath;
        }
      });
    },
    ExportSpecifier(nodePath) {
      if (
        !identifierPath
        && nodePath.node.exported.name === 'default'
        && T.isExportNamedDeclaration(nodePath.parentPath.node)
        && nodePath.parentPath.node.source
      ) {
        identifierPath = nodePath;
      }
    }
  });

  return identifierPath;
}

/** Given a module ast get reference to a specific export path */
function getExportPath(name, moduleAst) {
  if (name === 'default') {
    return getDefaultExportPath(moduleAst);
  }

  let identifierPath;

  const specifierVisitor = {
    ExportSpecifier(nodePath) {
      if (
        !identifierPath
        && nodePath.node.exported.name === name
      ) {
        identifierPath = nodePath;
      }
    }
  };

  const identifierVisitor = {
    Identifier(identifierNodePath) {
      if (!identifierPath && identifierNodePath.node.name === name) {
        identifierPath = identifierNodePath;
      }
    }
  };

  traverse(moduleAst, {
    ExportNamedDeclaration(nodePath) {
      if (!identifierPath && nodePath.node.specifiers.length) {
        nodePath.traverse(specifierVisitor);
      } else {
        nodePath.traverse(identifierVisitor);
      }
    }
  });

  return identifierPath;
}

/**
 * Given a path resolve it's definition which may be found in other modules.
 * Ie. This is not resolving the binding within the bounds of a module but will
 * also resolve imports to find the very root definition.
 *
 * Note: nodePath could be an Identifier path OR ExportSpecifier path
 */
export function resolveDefinition(module, nodePath, resolveModule) {
  // export {definition as definition} from 'other-module';
  if (T.isExportSpecifier(nodePath.node) && nodePath.parent.source) {
    const importModulePath = nodePath.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getExportPath(nodePath.node.local.name, importedModule.ast);

    return resolveDefinition(importedModule.path, identifier, resolveModule);
  }

  const binding = T.isExportSpecifier(nodePath.node)
    ? nodePath.scope.getBinding(nodePath.node.local.name)
    : nodePath.scope.getBinding(nodePath.node.name);

  // const definition = 'foo';
  if (T.isVariableDeclarator(binding.path.node)) {
    const definition = binding.path;
    return {
      binding,
      definition,
      module
    };
  }

  // function definition() {};
  if (T.isFunctionDeclaration(binding.path.node)) {
    const definition = binding.path;
    return {
      binding,
      definition,
      module
    };
  }

  // import {definition} from './other-module';
  if (T.isImportSpecifier(binding.path.node)) {
    const importModulePath = binding.path.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getExportPath(binding.path.node.imported.name, importedModule.ast);

    return resolveDefinition(importedModule.path, identifier, resolveModule);
  }

  // import definition from './other-module';
  if (T.isImportDefaultSpecifier(binding.path.node)) {
    const importModulePath = binding.path.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getDefaultExportPath(importedModule.ast);

    return resolveDefinition(importedModule.path, identifier, resolveModule);
  }

  // ¯\_(ツ)_/¯
  return {
    failed: true,
    module
  };

}

/**
 * Like resolveDefinition but will attempt to resolve components through facades.
 * Eg.
 *   withState(MyComponent);
 *   createContainer(MyComponent, {});
 *   etc.
 */
export function resolveRootComponentDefinition(nodePath, resolveFile) {

}

/**
 * Resolve a component definition taking into account facades and composiiton
 */
export function resolveComponentDefinition() {
  // TODO: Implement
}
