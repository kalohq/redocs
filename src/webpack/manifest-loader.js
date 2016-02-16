/* eslint-disable */
var ReactDocgen = require('react-docgen');
var babylon = require('babylon');
var t = require('babel-types');
var traverse = require('babel-traverse').default;
var fs = require('fs');
var generate = require('babel-generator').default;

module.exports = function loadManifest(originalSource) {
  var callback = this.async();

  var ast = babylon.parse(originalSource, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'objectRestSpread'
    ]
  });

  var manifest;
  var componentPath;
  var resolveComponent = this.resolve.bind(this, this.context);

  traverse(ast, {
    "ExportDefaultDeclaration": function(nodePath) {
      // default export is considered the component manifest
      manifest = nodePath;

      // find a reference to our main component this manifest is defining
      var componentVar = manifest.node.declaration.properties.find(function(property) {
        return property.key.name === 'component';
      }).value.name;
      // assuming our component reference is an import...
      componentPath = nodePath.scope.getBinding(componentVar).path.parent.source.value;

      // lets find our fixtures and store the source along with fixture ref
      nodePath.traverse({
        "Property": function(nodePath){
          if (nodePath.node.key.name === 'fixtures') {
            // find each identifier (fixture reference)
            nodePath.traverse({
              "Identifier": function(nodePath) {
                if (nodePath.parent.type === 'ArrayExpression') {
                  var fixtureVar = nodePath.node.name;
                  var fixtureBinding = nodePath.scope.getBinding(fixtureVar);
                  var fixtureSource = t.stringLiteral(generate(fixtureBinding.path.node, {comments: false}, originalSource).code);
                  var componentProp = t.objectProperty(t.stringLiteral('component'), t.identifier(fixtureVar));
                  var sourceProp = t.objectProperty(t.stringLiteral('src'), fixtureSource);
                  var descriptionProp = t.objectProperty(
                    t.stringLiteral('description'),
                    t.stringLiteral(
                      fixtureBinding.path.node.leadingComments.length
                        ? fixtureBinding.path.node.leadingComments[0].value
                        : null
                    )
                  );
                  var fixtureObj = t.objectExpression([componentProp, sourceProp, descriptionProp]);
                  nodePath.replaceWith(fixtureObj);
                }
              }
            })
          }
        }
      })
    },
    enter: function(path) {
      //console.log(path.node.type + ':' + path.node.name);
    }
  })

  var componentSource = resolveComponent(componentPath, function(err, resolvedComponentPath) {
    fs.readFile(resolvedComponentPath, function(err, fileBuffer) {
      var docs = ReactDocgen.parse(fileBuffer.toString());
      var newProperty = t.objectProperty(t.stringLiteral('docs'), t.stringLiteral(JSON.stringify(docs, null, 2)));
      manifest.node.declaration.properties.push(newProperty);

      callback(null, generate(ast, null, originalSource).code);
    });
  });
};
