import React from 'react';

type Props = {
  /** Buttons */
  children: Array<ReactElement>
};

/** Component to display a set of Button's */
const ButtonGroup = ({children, ...props}: Props): ReactElement => (
  <div {...props}>{children}</div>
);

export default ButtonGroup;
