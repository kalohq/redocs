import React from 'react';
import ReactDOM from 'react-dom';

import {Playground} from 'redocs';

const reqManifests = require.context('./components', true, MATCH_COMPONENTS);
const componentManifests = reqManifests.keys().map(reqManifests)
  // normalise modules to just look at manifests
  .map(module => module.default)
  // ensure docs are parsed json
  .map(manifest => ({...manifest, docs: JSON.parse(manifest.docs)}));

const playground = (
  <Playground manifests={componentManifests} />
);

void (ReactDOM.render(playground, document.getElementById('app')));
