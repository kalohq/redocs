import * as T from 'babel-types';
import traverse from 'babel-traverse';

// TODO: Will need to think hard about how to improve the apis seen here (pluggability)

/**
 * Given a module ast get reference to a specific export path
 * NOTE: name === "default" is treated specially
 */
function getExportPath(name, moduleAst) {
  let identifierPath;

  // Find `export default definition;`
  const defaultVisitor = {
    ExportDefaultDeclaration(nodePath) {
      nodePath.traverse({
        Identifier(identifierNodePath) {
          identifierPath = identifierNodePath;
        }
      });
    }
  };

  if (name === 'default') {
    traverse(moduleAst, defaultVisitor);
  }

  // Find appropriate specifier in `export {foo as bar};`
  const specifierVisitor = {
    ExportSpecifier(nodePath) {
      if (nodePath.node.exported.name === name) {
        identifierPath = nodePath;
      }
    }
  };

  // pull identifier out of `export const definition = 'foo';`
  const identifierVisitor = {
    Identifier(identifierNodePath) {
      if (!identifierPath && identifierNodePath.node.name === name) {
        identifierPath = identifierNodePath;
      }
    }
  };

  const namedVisitor = {
    ExportNamedDeclaration(nodePath) {
      if (!identifierPath) {
        if (nodePath.node.specifiers.length) {
          nodePath.traverse(specifierVisitor);
        } else {
          nodePath.traverse(identifierVisitor);
        }
      }
    }
  };

  traverse(moduleAst, namedVisitor);

  return identifierPath;
}

/**
 * Given a path resolve it's definition which may be found in other modules.
 * Ie. This is not resolving the binding within the bounds of a module but will
 * also resolve imports to find the very root definition.
 *
 * Note: nodePath should be an Identifier path OR ExportSpecifier path within
 *       the scope of the specified module
 */
export function resolveDefinition(nodePath, module, resolveModule) {
  // export {definition as definition} from 'other-module';
  if (T.isExportSpecifier(nodePath.node) && nodePath.parent.source) {
    if (!resolveModule) {
      return {failed: true};
    }

    const importModulePath = nodePath.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getExportPath(nodePath.node.local.name, importedModule.ast);

    return resolveDefinition(identifier, importedModule.path, resolveModule);
  }

  const binding = T.isExportSpecifier(nodePath.node)
    ? nodePath.scope.getBinding(nodePath.node.local.name)
    : nodePath.scope.getBinding(nodePath.node.name);

  if (!binding) {
    return {failed: true};
  }

  // const definition = 'foo';
  // function definition() {};
  // class Definition {}
  if (
    T.isVariableDeclarator(binding.path.node)
    || T.isFunctionDeclaration(binding.path.node)
    || T.isClassDeclaration(binding.path.node)
  ) {
    return {
      binding,
      module
    };
  }

  // import {definition} from './other-module';
  if (T.isImportSpecifier(binding.path.node)) {
    if (!resolveModule) {
      return {failed: true};
    }

    const importModulePath = binding.path.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getExportPath(binding.path.node.imported.name, importedModule.ast);

    return resolveDefinition(identifier, importedModule.path, resolveModule);
  }

  // import definition from './other-module';
  if (T.isImportDefaultSpecifier(binding.path.node)) {
    if (!resolveModule) {
      return {failed: true};
    }

    const importModulePath = binding.path.parent.source.value;
    const importedModule = resolveModule(module, importModulePath);
    const identifier = getExportPath('default', importedModule.ast);

    return resolveDefinition(identifier, importedModule.path, resolveModule);
  }

  // ¯\_(ツ)_/¯
  return {
    failed: true
  };

}
