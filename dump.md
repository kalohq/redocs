Redocs Mind Dump
================

Place to save crazy ideas for future of redocs and all related stuff.

- View component dependency tree
  - Is it possible to walk render paths to show component usage based off of props?!
  - Very useful to dive into what components are made up of
  - Very useful to see where a component is used
- Click hotkey to open components from dev build
- Ensure Tota11ly is integrated for testing
- Integrate with https://spiritjs.io/
- Need to explore the "fixture manifest"" which gets default exported from fixture files
  - Eg. should this become more of a general-purpose "component manifest"
    - I lean towards not so to not pidgen-hole HOW to structure apps
- Check out Deco React-Native IDE
  - Nice property editing
  - Stubs props (we had similar ideas with generating fixtures)
- Different view modes
  - "Development mode" - Focus on a single component/fixture
  - "Browse mode" - Explore components
- Store co-located resources with components (eg. not neccesserily deps but designs, ux diagrams etc)
  - use webpack baggage-loader!
- Highlight direct asset dependencies
- Ability to play with prop values of fixtures
  - How do we do this now we've abstracted away into components?
    - Fixtures can opt in by allowing pass-through props?
- Hooking into git/github and highlighting affected components would be awesome...
- How can we resolve components through hocs and other facades?
  - Having hooks and customizability to every step of the process will allow it to become more intelligent and personalised over many codebases.
  - Simple method for now is to follow code paths and look through function expressions to see if used parameters are components
    - How can we further augment these definitions with the compositional layers (usually extra props) put in place by facades (such as a HOC)
- Existing solutions make too many assumptions about your component locations and composition
  - Eg. redocs breaks with hocs and doesn't follow exact imports from module deps
  - We need to aim to be clever about how we locate components (need to reverse and traverse deps!)
- ReactPerf integration for thrash testing?
  - Highlights how we could do various sanity testing (on top of fixed tests) such as highlight performance concerns, accessibility concerns etc.
- Pluggable!!
  - As well as the customisation over component resolution and what not we should provide a nice way to plugin to the playground so others can write cool tools
- Aggregate the variations of props you use throughout your app
  - Identify common props which could be abstracted away or discover more sensible defaults
- Plug in react perf tools! (give your component a series of props (or randomised)) and have perf highlighted.
- https://github.com/jxnblk/react-component-permutations
- How do we support other component libraries (not react!) or even react in other langs?! (v. long-term)
- How to provide benefit for multiple platforms?
  - Resolution pipeline can stay as-is but will need multiple clones of Playground framework to support other platforms (can share much logic but final component implementation needs to be native to platform)
- Maybe react-docgen should be merged... :/
- SO. MANY. PARSERS. SO. MANY. TRAVERSALS. SO. MANY. MUTATIONS!!!
- I remember iconic framework doing a lot of cool stuff with their framework/devtools
- One of the biggest selling points of redocs came when updating the underlying (root) primitive components across our app.
  - Nightmare to trawl through and find any potential visual regressions


### Alternatives

- react-styleguidist
- Atellier
- Storybook
- Others???

BUT. Redocs can *power* these. See below...

### What exactly will redocs provide

Trying to define a reasonable scope here...

> "An tool for generating intelligent UI-Component documentation"

- Intelligent pipeline for resolving component documentation
- Component framework for rendering component documentation

> "Pluggable out-the-box!"

- Custom resolution. People do crazy things (enabled by dynamic nature of JS), we need to learn these over time.

> "There should be a large redocs ecosystem"

So looking back at "alternatives"

- react-styleguidist - we can provide more intelligent resolution of data
- Atellier - Same as above
- Storybook - we can power extra resolution of data and provide story component info
- Others???

### Vision Beyond

> The long term vision is becoming (using redocs as a base) a workflow tool to bridge the design-development gap, improve engineering efficiency and provide an optimum environment for rapid product development.

- Consider how this works in a world without React

### Notes for contributing

- babel/plugin-handbook to understand how we parse and traverse code - https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md#toc-visitors
- estree spec for node types - https://github.com/estree/estree
- Further understanding of babel tree traversal (especially nicely organised path methods) - https://github.com/babel/babel/tree/master/packages/babel-traverse/src
