import React from 'react';

import SearchBar from '../search-bar';

/** Boring search bar */
function BoringSearchBar(): ReactElement {
  return (
    <SearchBar value="Search Value..." />
  );
}

/** Boring search bar with lucky search capability */
function LuckySearchBar(): ReactElement {
  return (
    <SearchBar value="Search Value..." canLucky={true} />
  );
}

export default {
  component: SearchBar,
  fixtures: [
    BoringSearchBar,
    LuckySearchBar
  ]
};
