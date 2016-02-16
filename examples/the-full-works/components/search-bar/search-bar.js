import React from 'react';

import Input from '../input';
import Button from '../button';
import ButtonGroup from '../button-group';

type Props = {
  /** Current search query */
  searchQuery: string,
  /** Whenever the user changes the query */
  onChange: Function,
  /** Whenever the user indicates they want to search */
  onSearch: Function,
  /** Whenever the user indicates they're feeling lucky */
  onLucky?: Function,
  /** Can the user be lucky? */
  canLucky?: bool
};

/** Search bar component with search/feelin' lucky buttons */
const SearchBar = ({onChange, searchQuery, onSearch, onLucky, canLucky, ...props}: Props): ReactElement => (
  <div {...props}>
    <Input onChange={onChange} value={searchQuery} />
    <ButtonGroup>
      <Button onClick={onSearch}>Search</Button>
      {canLucky ? (
        <Button onClick={onLucky}>Feeling Lucky</Button>
      ) : null}
    </ButtonGroup>
  </div>
);

export default SearchBar;
