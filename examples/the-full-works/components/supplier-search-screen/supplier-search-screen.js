import React from 'react';
import {withState} from 'recompose';

import SearchBar from '../search-bar/search-bar';

type Props = {
  /** The current search query */
  searchQuery: string,
  /** On user search submission */
  onSearch: Function,
  /** Current search results */
  results: Array<string>
};

/** Screen for searching and displaying suppliers */
const _SupplierSearchScreen = ({searchQuery, onSearch, results, ...props}: Props): ReactElement => (
  <div {...props}>
    <SearchBar searchQuery={searchQuery} onSearch={onSearch} />
    <ul>
      {results.map(result => <li key={result}>{result}</li>)}
    </ul>
  </div>
);

/** Contained */
const SupplierSearchScreen = withState(
  'test',
  'setTest',
  false
)(_SupplierSearchScreen);

export default SupplierSearchScreen;
