import React from 'react';

type Props = {
  /** Text for the button */
  children: string
};

/** Low level button componnet */
const Button = ({children, ...props}: Props): ReactElement => (
  <button {...props}>{children}</button>
);

export default Button;
