# babel-plugin-transform-e4x

[![Version](https://img.shields.io/npm/v/babel-plugin-transform-e4x.svg)](https://npmjs.org/package/babel-plugin-transform-e4x)
[![Build Status](https://img.shields.io/travis/pikamachu/babel-plugin-transform-e4x/master.svg)](https://travis-ci.org/pikamachu/babel-plugin-transform-e4x)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a5d465f487e4f55a8e50e8201cc69b1)](https://www.codacy.com/project/antonio.marin.jimenez/babel-plugin-transform-e4x/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikamachu/babel-plugin-transform-e4x&amp;utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/pikamachu/babel-plugin-transform-e4x/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/babel-plugin-transform-e4x)

## Introduction

Babel plugin for obsolete e4x xml processing


## Usage

``` bash
npm install\
  babel-plugin-transform-e4x\
  babel-preset-env\
  --save-dev
```

In your `.babelrc`:

``` json
{
  "presets": ["env"],
  "plugins": ["transform-e4x"]
}
```

The plugin transpiles the following JSX:

``` xml
var fooId = 'foo-id';
var barText = 'bar text';
var xml =
    <xml>
        <foo id="{fooId}">{barText}</foo>
    </xml>;
```

To the following JavaScript:

``` js
var xml;
require('xml2js').parseString(
    '<xml><foo id="foo-id">bar text</foo></xml>',
    options,
    function (err, res) {
        xml = res;
    }
);
```

See tests for more examples and details.

## Requirements

- Babel 7 compatible


## Developing

### Built with

* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)

### Folder structure

* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration files.
* lib: Contains the source code for plugin.
* test: Contains library tests and examples.
* examples: Contains library examples.
* node_modules: Contains third party JS libraries used in this project

### Setting up Dev

Download the code

```shell
git clone git@github.com:pikamachu/babel-plugin-transform-e4x.git
cd babel-plugin-transform-e4x
```

Install dependencies

```shell
bash pika install
```

Run application tests.

```shell
bash pika test
```
