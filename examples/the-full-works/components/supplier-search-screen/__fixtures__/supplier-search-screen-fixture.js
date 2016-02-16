import React from 'react';
/*import rand from 'rand';*/

import SupplierSearchScreen from '../supplier-search-screen';

/** Pretty plain search page */
function BoringSearchScreen(): ReactElement {
  return (
    <SupplierSearchScreen
      searchQuery="Supplier Search Query"
      results={[
        'Supplier 1',
        'Supplier 2',
        'Supplier 3'
      ]}
    />
  );
}

/** Test extension */
const expectBoringSearchScreen = {
  'to contain with all children': [
    () => (
      <div>
        <li>Supplier 1</li>
        <li>Supplier 2</li>
        <li>Supplier 3</li>
      </div>
    ),
    () => (
      <input value="Supplier Search Query" />
    )
  ]
};

/** Randomly generated search screen */
/*function RandomSearchScreen(): ReactElement {
  return (
    <SupplierSearchScreen
      searchQuery={rand.string(0, 140)}
      results={rand.array(0, 20, () => rand.string(0, 30))}
    />
  );
}*/

export default {
  component: SupplierSearchScreen,
  fixtures: [
    BoringSearchScreen/*,
    RandomSearchScreen*/
  ],
  // Test extension
  tests: [
    {fixture: BoringSearchScreen, expect: expectBoringSearchScreen}
  ]
};
