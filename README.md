# JSKit

Load common JavaScript libraries into Chrome tabs/windows

## Changes

0.2.6

- reduced memory usage by keeping a single "scripts" dataset
- adding a new custom script makes it available across all tabs

0.2.5

- loading custom scripts provided by user input URL

0.2.3

- added proper version numbers for Underscore.js and Backbone.js
- added filter

0.2.2

- properly capturing / restoring "loaded" state of libraries per tab

## Todo

- ensure dependency loading waits for completion before proceeding with module
