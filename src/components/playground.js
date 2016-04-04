import React from 'react';
import {getDisplayName} from '../utils/runtime/react';
import {Flex, Block, Inline} from './core';
import {rgb} from 'jsxstyle';
import {escape} from 'lodash';
import {withState} from 'recompose';

const TRANSPARENT_BG = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQYV2NkYGCQZMAEz9GFGIeIQix+wfQgyDODXSEANN4FiOUn0M8AAAAASUVORK5CYII=) repeat'; // eslint-disable-line max-len
const FONT_FAMILY = 'Source Sans Pro, sans-serif';
const LONG_FONT_FAMILY = 'Times, serif';

/** Lowest level type component */
const Text = ({children, ...otherProps}) => (
  <Inline fontFamily={FONT_FAMILY} color={rgb(61, 67, 81)} {...otherProps}>{children}</Inline>
);

/** Type component suitable for longer chunks of text */
const LongText = ({children, ...otherProps}) => (
  <Text display="block" component="p" fontFamily={LONG_FONT_FAMILY} lineHeight="1.5em" {...otherProps}>{children}</Text>
);

/** Low level link component */
const Link = ({children, disabled, ...otherProps}) => (
  <Text component="a" color="inherit" cursor={disabled ? undefined : 'pointer'} {...otherProps}>{children}</Text>
);

/** Base heading type component */
const Heading = ({children, level = 1, ...otherProps}) => (
  <Text display="block" component={`h${level}`} {...otherProps}>{children}</Text>
);

/** Render a set of component fixtures */
const Fixtures = ({fixtures, ...otherProps}) => (
  <Block {...otherProps}>
    {fixtures.map(fixture => (
      <Fixture key={getDisplayName(fixture.component)} fixture={fixture} />
    ))}
  </Block>
);

/** Render a large section heading */
const SectionHeading = ({children, permalink, ...otherProps}) => (
  <Flex padding="15px 30px" alignItems="center" background={rgb(26, 158, 214)} id={permalink} {...otherProps}>
    <Heading level={2} color={rgb(255, 255, 255)}>
      <Link href={`#${permalink}`} textDecoration="none">
        {children}
      </Link>
    </Heading>
  </Flex>
);

/** Render the main body of a section */
const SectionBody = ({children, ...otherProps}) => (
  <Flex alignItems="stretch" {...otherProps}>
    {children}
  </Flex>
);

/** Render a details panel within a section */
const SectionDetails = ({children, ...otherProps}) => (
  <Block borderLeft="1px solid" borderLeftColor={rgb(230, 232, 240)} {...otherProps}>
    {children}
  </Block>
);

/** Basic separator for inline content */
const Separator = () => (
  <span> | </span>
);

/** Render a single component fixture */
const _Fixture = ({fixture: {component: FixtureComponent, src, description}, setMode, mode, ...otherProps}) => (
  <Block id={`component_fixture_${getDisplayName(FixtureComponent)}`} {...otherProps}>
    <Flex alignItems="center" justifyContent="space-between">
      <Heading level={4}>
        <Link href={`#component/fixture/${getDisplayName(FixtureComponent)}`} textDecoration="none">
          {getDisplayName(FixtureComponent)}
        </Link>
      </Heading>
      <Block>
        <Link onClick={() => setMode(() => 'preview')}>Preview</Link>
        <Separator />
        <Link onClick={() => setMode(() => 'details')}>Details</Link>
      </Block>
    </Flex>
    {mode === 'preview' ? (
      <Flex alignItems="center" justifyContent="center" background={TRANSPARENT_BG} padding={30}>
        <FixtureComponent />
      </Flex>
    ) : (
      <Block>
        <Heading level={4}>Description</Heading>
        <LongText>{description || 'No fixture description! :('}</LongText>
        <Heading level={4}>Source</Heading>
        <Block component="pre" maxWidth="100%" overflow="auto" dangerouslySetInnerHTML={{__html: escape(src)}} />
      </Block>
    )}
  </Block>
);

const Fixture = withState(
  'mode',
  'setMode',
  'preview',
  _Fixture
);


/** Render documentation for a component */
const ComponentDocs = ({docs, ...otherProps}) => (
  <Block {...otherProps}>
    <Heading level={4}>Description</Heading>
    <LongText>{docs.description || 'No component description! :('}</LongText>
    <Heading level={4}>Props</Heading>
    <Block component="pre" maxWidth="100%" overflow="auto">
      {JSON.stringify(docs.props, null, 2)}
    </Block>
  </Block>
);

/** Render everything to do with a specific component */
const Component = ({manifest, ...otherProps}) => (
  <Flex flexDirection="column" {...otherProps}>
    <SectionHeading permalink={`component/${getDisplayName(manifest.component)}`}>
      {getDisplayName(manifest.component)}
    </SectionHeading>
    <SectionBody>
      <Block flex={3} padding={30}>
        <Fixtures fixtures={manifest.fixtures} />
      </Block>
      <SectionDetails flex={1} padding={30}>
        <ComponentDocs docs={manifest.docs} />
      </SectionDetails>
    </SectionBody>
  </Flex>
);

/** Creates a playground UI for exploring and developing components */
const Playground = ({manifests, ...otherProps}) => (
  <Flex flexDirection="column" {...otherProps}>
    <Block padding={5} background={rgb(0, 0, 20)}>
      <Heading level={5} margin={0} fontWeight="normal" color={rgb(255, 255, 255)}>
        Redocs Playground - {manifests.length} components found
      </Heading>
    </Block>
    {manifests.map(manifest => (
      <Component
        key={getDisplayName(manifest.component)}
        manifest={manifest}
      />
    ))}
  </Flex>
);

export default Playground;
