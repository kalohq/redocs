import * as T from 'babel-types';
import traverse from 'babel-traverse';

// TODO: Will need to think hard about how to improve the apis seen here (pluggability)

/** Given a module ast get reference to the default export identifier path */
function getDefaultExportIdentifier(moduleAst) {
  let identifierPath;

  traverse(moduleAst, {
    ExportDefaultDeclaration(nodePath) {
      nodePath.traverse({
        Identifier(identifierNodePath) {
          identifierPath = identifierNodePath;
        }
      });
    }
  });

  return identifierPath;
}

/** Given a module ast get reference to a specific export identifier path */
function getExportIdentifier(name, moduleAst) {
  let identifierPath;

  traverse(moduleAst, {
    ExportNamedDeclaration(nodePath) {
      nodePath.traverse({
        Identifier(identifierNodePath) {
          if (identifierNodePath.node.name === name) {
            identifierPath = identifierNodePath;
          }
        }
      });
    }
  });

  return identifierPath;
}

/**
 * Given a path resolve it's definition which may be found in other modules.
 * Ie. This is not resolving the binding within the bounds of a module but will
 * also resolve imports to find the very root definition.
 */
export function resolveDefinition(module, identifierPath, resolveModule) {
  const binding = identifierPath.scope.getBinding(identifierPath.node.name);

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
    const identifier = getExportIdentifier(binding.path.node.imported.name, importedModule.ast);

    return resolveDefinition(importedModule.path, identifier, resolveModule);
  }

  // import definition from './other-module';
  if (T.isImportDefaultSpecifier(binding.path.node)) {
    const importModulePath = binding.path.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getDefaultExportIdentifier(importedModule.ast);

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
export function resolveRootComponentDefinition(identifierPath, resolveFile) {

}

/**
 * Resolve a component definition taking into account facades and composiiton
 */
export function resolveComponentDefinition() {
  // TODO: Implement
}
