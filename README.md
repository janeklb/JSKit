# JSKit

Load common JavaScript libraries into Chrome tabs/windows

## Changes

0.3

- packaged with [xray.js](https://github.com/janeklb/xray.js/blob/master/xray.js)

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
