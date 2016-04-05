import * as ReactDocgen from 'react-docgen';
import {parse} from 'babylon';
import * as t from 'babel-types';
import traverse from 'babel-traverse';
import fs from 'fs';
import generate from 'babel-generator';

function loadManifest(originalSource) {
  const callback = this.async();

  const ast = parse(originalSource, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'objectRestSpread'
    ]
  });

  let manifest;
  let componentPath;
  const resolveComponent = this.resolve.bind(this, this.context);

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      // default export is considered the component manifest
      manifest = path;

      // find a reference to our main component this manifest is defining
      const componentVar = manifest.node.declaration.properties.find(
        property => property.key.name === 'component'
      ).value.name;
      // assuming our component reference is an import...
      componentPath = path.scope.getBinding(componentVar).path.parent.source.value;

      // lets find our fixtures and store the source along with fixture ref
      path.traverse({
        Property(manifestPropNodePath) {
          if (manifestPropNodePath.node.key.name === 'fixtures') {
            // find each identifier (fixture reference)
            manifestPropNodePath.traverse({
              Identifier(fixtureReferenceNodePath) {
                if (fixtureReferenceNodePath.parent.type === 'ArrayExpression') {
                  const fixtureVar = fixtureReferenceNodePath.node.name;
                  const fixtureBinding = fixtureReferenceNodePath.scope.getBinding(fixtureVar);
                  const fixtureSource = t.stringLiteral(generate(fixtureBinding.path.node, {comments: false}, originalSource).code);
                  const componentProp = t.objectProperty(t.stringLiteral('component'), t.identifier(fixtureVar));
                  const sourceProp = t.objectProperty(t.stringLiteral('src'), fixtureSource);
                  const descriptionProp = t.objectProperty(
                    t.stringLiteral('description'),
                    t.stringLiteral(
                      fixtureBinding.path.node.leadingComments.length
                        ? fixtureBinding.path.node.leadingComments[0].value
                        : null
                    )
                  );
                  const fixtureObj = t.objectExpression([componentProp, sourceProp, descriptionProp]);
                  fixtureReferenceNodePath.replaceWith(fixtureObj);
                }
              }
            });
          }
        }
      });
    }
  });

  resolveComponent(componentPath, (resolveErr, resolvedComponentPath) => {
    fs.readFile(resolvedComponentPath, (readErr, fileBuffer) => {
      try {
        // TODO: May be worth writing a modern version of docgen which uses a babel-tree?
        // SEE: https://github.com/reactjs/react-docgen/issues/68
        const docs = ReactDocgen.parse(fileBuffer.toString());
        const newProperty = t.objectProperty(t.stringLiteral('docs'), t.stringLiteral(JSON.stringify(docs, null, 2)));
        manifest.node.declaration.properties.push(newProperty);
      } catch (err) {
        this.emitWarning(`${err.message} <${resolvedComponentPath}>`);
        const newProperty = t.objectProperty(t.stringLiteral('docs'), t.stringLiteral(JSON.stringify({error: true}, null, 2)));
        manifest.node.declaration.properties.push(newProperty);
      }

      callback(null, generate(ast, null, originalSource).code);
    });
  });
}

module.exports = loadManifest;
