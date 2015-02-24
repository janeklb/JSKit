## Changelog

0.4.2

- added CHANGELOG.md
- auto-focusing 'filter' input after opening JSKit

0.4.1

- added xray.js (https://github.com/janeklb/xray.js)

0.4

- loading scripts from www.cdnjs.com
- loading files ending in .css as <link .../> tags

0.3.2.1

- added support for https sites

0.3.1

- updated popup font to 'Lato'
- autoloading new scripts on by default

0.3

- packaged with [xray.js](https://github.com/janeklb/xray.js)

0.2.7

- added links to script homepages, updated font

0.2.6.2

- bugfix: ensuring a scripts dependencies fully load before the script does

0.2.6.1

- bugfix: resetting loaded scripts for tabs on refresh/navigate

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
