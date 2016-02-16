import React from 'react';

import ButtonGroup from '../button-group';
import Button from '../../button';

/** Basic boring group of buttons */
function BoringButtonGroup(): ReactElement {
  return (
    <ButtonGroup>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
    </ButtonGroup>
  );
}

export default {
  component: ButtonGroup,
  fixtures: [
    BoringButtonGroup
  ]
};
