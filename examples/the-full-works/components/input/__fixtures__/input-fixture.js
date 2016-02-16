import React from 'react';

import Input from '../input';

/** A simple boring text input */
function BoringInput(): ReactElement {
  return (
    <Input value="Type a value..." type="text" />
  );
}

export default {
  component: Input,
  fixtures: [
    BoringInput
  ]
};
