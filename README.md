# Tell-cli

[![Built with Grunt][grunt-img]](http://gruntjs.com/) [![MIT License][license-img]][license-url]

> Generates [Mocha](https://mochajs.org) files from an YML description file<br>
> Provides an easy way to describe your stories

## Install

```bash
npm install -g tell-cli
```

> **must be installed globally**

## Usages

> An yaml **stories.yml** file as describe [below](#stories.yml) must be placed in your *spec | tests |...* folder

```bash
# output stories in console, doesn't generate spec files
tell spec
# prompts for overwite specs files - default to false
tell spec --generate
tell spec -g
# doesn't prompts
tell spec --generate --yes
tell spec -g -Y
```

<a name="stories.yml"></a>
### stories.yml

```yml
src/filename.js:
  render:
    - throw if no argument
    - should return a string
    - should return helloworld
  a_function_name:
    other_cases
      - returns false if no arguments
      - returns arguments is empty
      - returns false is not a plainobject
      - returns options property 'name' is not defined
      - expect to returns array of arguments
    other_other_cases:
      - returns false if no arguments
      - returns arguments is empty
      - returns false is not a plainobject
      - returns options property <name> is not defined
      - expect to returns array of arguments
src/an_other_filename.js:
  - throw if no argument
  - should return a string
  - should return helloworld
```

## Issues

- Not tested under UNIX
- No unit tests...

## Dependencies

- [**chalk** ^1.1.0](https://www.npmjs.com/package/chalk)
- [**commander** ^2.8.1](https://www.npmjs.com/package/commander)
- [**esformatter** ^0.7.3](https://www.npmjs.com/package/esformatter)
- [**fs-extra** ^0.23.1](https://www.npmjs.com/package/fs-extra)
- [**inquirer** ^0.9.0](https://www.npmjs.com/package/inquirer)
- [**is-valid-path** ^0.1.1](https://www.npmjs.com/package/is-valid-path)
- [**js-yaml** ^3.3.1](https://www.npmjs.com/package/js-yaml)
- [**lodash.isarray** ^3.0.4](https://www.npmjs.com/package/lodash.isarray)
- [**lodash.template** ^3.6.2](https://www.npmjs.com/package/lodash.template)

[grunt-img]: https://cdn.gruntjs.com/builtwith.png
[license-img]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE-MIT

[coverall-url]: https://coveralls.io/r/sixertoy/tell-cli
[coverall-img]: https://img.shields.io/coveralls/sixertoy/tell-cli.svg?style=flat-square

[travis-url]: https://travis-ci.org/sixertoy/tell-cli
[travis-img]: http://img.shields.io/travis/sixertoy/tell-cli.svg?style=flat-square
