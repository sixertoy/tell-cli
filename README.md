# Tell-cli

[![Built with Grunt][grunt-img]](http://gruntjs.com/) [![MIT License][license-img]][license-url]

> Generates [Mocha](https://mochajs.org) files from an YML description file<br>
> Provides an easy way to describe your stories

## Install

```bash
npm install -g tell-cli
```

## Usages

> An yaml **stories.yml** file as describe [below](#stories.yml) must be place in <spec | tests |...> folder

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
```

## Issues

- Not tested under UNIX
- No unit tests...

[grunt-img]: https://cdn.gruntjs.com/builtwith.png
[license-img]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE-MIT

[coverall-url]: https://coveralls.io/r/sixertoy/tell-cli
[coverall-img]: https://img.shields.io/coveralls/sixertoy/tell-cli.svg?style=flat-square

[travis-url]: https://travis-ci.org/sixertoy/tell-cli
[travis-img]: http://img.shields.io/travis/sixertoy/tell-cli.svg?style=flat-square
