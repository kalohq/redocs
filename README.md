Redocs
======

Powerful documentation utilities for React

What it looks like
------------------

**The *true* living styleguide** which provides both a Visual Styleguide and quick
Component API Reference but also the ability to view the component makeup of an
app via a dependency graph.

Goals
-----

- One-command results (no need for extra code or config to get going)
- ComponentFixture powered (ComponentTree ???)
  - Auto-generated default fixtures
  - JS exported fixtures
- Can read dependencies to give idea of make-up
  - Component dependencies
  - CSS dependencies
  - Reverses to show dependants
- Output customization
  - Custom docs renderer support
  - component directory readme.md support
- IDE workflow pluggable
  - "jump to documentation from usage"
- Dev environment pluggable
  - ctrl+click component to "jump to documentation"
- No restrictions on environment/workflow
  - Customize where/how to find requirements
- ComponentFixtures nesting other components

User config
-----------

- How to find components
- How to find fixtures
- Extra dependencies to pull into documentation
  - default: `[/\.css$/]`
- Extra pages to create (global and/or per component)
  - default: `['readme.md']`
- Output directory
- Renderer config (depends on renderer used)

Tips
----

- One documented component per file
- Keep components as self-contained directories

Quick hacks
-----------

Hacks to get you *flying*

- [Host and auto-deploy to github pages](#)
- [Auto-generate base components](#)

Generation Strategy
-------------------

#### Step 1: Extraction

1. Find all components
2. Parse each component
  a. Parse prop documentation
  b. Analyse dependencies
3. Find all component fixtures
4. Generate default fixtures for each component which has non defined
5. Find supporting resources such as component `readme.md`
6. Combine all discovered structured data
7. Pass along to renderer

#### Step 2: Default render

Generate a static web app:

1. Generate separate webpack chunks for each component
2. Generate stats/a dependency graph webpack chunk
3. Generate user content webpack chunks (eg. custom `tutorial.md`)
4. Generate containing app

#### Step 3: Output

1. Output to `/docs` by default or user-defined

License
-------

Apache 2.0
