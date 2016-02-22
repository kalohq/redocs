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
- Existing solutions make too many assumptions about your component locations and composition
  - Eg. redocs breaks with hocs and doesn't follow exact imports from module deps
  - We need to aim to be clever about how we locate components (need to reverse and traverse deps!)
- ReactPerf integration for thrash testing?
  - Highlights how we could do various sanity testing (on top of fixed tests) such as highlight performance concerns, accessibility concerns etc.
- Pluggable!!
  - As well as the customisation over component resolution and what not we should provide a nice way to plugin to the playground so others can write cool tools

### Alternatives

- react-styleguidist
- Atellier
- Others???

### What exactly will redocs provide

Trying to define a reasonable scope here...

> "An intelligent pipeline for generating UI-Component documentation"

- Intelligent pipeline for resolving component documentation
- Playground for rendering component documentation

> "Every step should be pluggable"

- Custom resolution around a generic structure

> "There should be a large redocs ecosystem"

### Vision Beyond

> The long term vision is becoming (using redocs as a base) a workflow tool to bridge the design-development gap, improve engineering efficiency and provide an optimum environment for rapid product development.

- Consider how this works in a world without React
