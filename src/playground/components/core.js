import React from 'react';
import pickBy from 'lodash/fp/pickby';

/** Make component style object from props */
function makeStyle(display, {style, ...otherProps}) {
  return {
    display,
    ...pickBy((v, k) => document.body.style.hasOwnProperty(k), otherProps),
    ...style
  };
}

/** Flex-based building block */
export const Flex = ({component: Component = 'div', ...otherProps}) => (
  <Component {...otherProps} style={makeStyle('flex', otherProps)} />
);

/** Block-based building block */
export const Block = ({component: Component = 'div', ...otherProps}) => (
  <Component {...otherProps} style={makeStyle('block', otherProps)} />
);

/** Inline-based building block */
export const Inline = ({component: Component = 'span', ...otherProps}) => (
  <Component display="inline" {...otherProps} style={makeStyle('inline', otherProps)} />
);
