import React from 'react';
import Button from '../button';

/** Pretty boring button */
function BoringButton(): ReactElement {
  return (
    <Button>Plain Button!</Button>
  );
}

/** Simple rounded button */
function RoundButton(): ReactElement {
  return (
    <Button style={{borderRadius: 10}}>
      Round Button!
    </Button>
  );
}

/** ALERT ALERT ALERT */
function AlertButton(): ReactElement {
  return (
    <Button
      style={{
        background: 'red',
        color: 'white',
        fontSize: '20px'
      }}
    >
      Alert Button!
    </Button>
  );
}

/** Manifest */
export default {
  component: Button,
  fixtures: [
    BoringButton,
    RoundButton,
    AlertButton
  ]
};
