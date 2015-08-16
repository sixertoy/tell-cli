# Tell-cli

[![Built with Grunt][grunt-img]](http://gruntjs.com/) [![MIT License][license-img]][license-url]

> Generates [Mocha](https://mochajs.org) files from an YML description file<br>
> Provides an easy way to describe/write/anticipate your units test's cases

## Install

```bash
npm install -g tell-cli
```

## Usages

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

## Issues

[grunt-img]: https://cdn.gruntjs.com/builtwith.png
[license-img]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: LICENSE-MIT

[coverall-url]: https://coveralls.io/r/sixertoy/tell-cli
[coverall-img]: https://img.shields.io/coveralls/sixertoy/tell-cli.svg?style=flat-square

[travis-url]: https://travis-ci.org/sixertoy/tell-cli
[travis-img]: http://img.shields.io/travis/sixertoy/tell-cli.svg?style=flat-square
