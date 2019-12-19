# babel-plugin-transform-simple-e4x

[![Version](https://img.shields.io/npm/v/babel-plugin-transform-simple-e4x.svg)](https://npmjs.org/package/babel-plugin-transform-simple-e4x)
[![Build Status](https://img.shields.io/travis/pikamachu/pika-babel-plugin-transform-simple-e4x/master.svg)](https://travis-ci.com/pikamachu/pika-babel-plugin-transform-simple-e4x)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a5d465f487e4f55a8e50e8201cc69b1)](https://www.codacy.com/project/antonio.marin.jimenez/pika-babel-plugin-transform-simple-e4x/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikamachu/pika-babel-plugin-transform-simple-e4x&amp;utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/pikamachu/pika-babel-plugin-transform-simple-e4x/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/pika-babel-plugin-transform-simple-e4x)

## Introduction

Babel plugin for obsolete e4x xml processing.

## Usage

``` bash
npm install\
  babel-plugin-transform-simple-e4x\
  babel-preset-env\
  --save-dev
```

In your `.babelrc`:

``` json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["babel-plugin-transform-simple-e4x"]
}
```

The plugin transpiles the following E4X:

``` xml
var fooId = 'foo-id';
var barText = 'bar text';
var xml =
    <xml>
        <foo id={fooId}>
          {barText}
        </foo>
    </xml>;
```

To the following JavaScript:

``` js
var XML = new require("simple4x");

var fooId = 'foo-id';
var barText = 'bar text';
var xml = new XML("<xml><foo id=\"" + fooId + "\">" + barText + "</foo></xml>");
```

See tests for more examples and details.

## Requirements

- Babel 7 compatible

## Developing

### Built with

* [simple4x](https://github.com/pikamachu/pika-simple-e4x)

### Folder structure

* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration files.
* lib: Contains the source code for plugin.
* test: Contains library tests and examples.
* examples: Contains library examples.
* node_modules: Contains third party JS libraries used in this project

### Setting up Dev

Download the code

```shell
git clone git@github.com:pikamachu/pika-babel-plugin-transform-simple-e4x.git
cd pika-babel-plugin-transform-simple-e4x
```

Install dependencies

```shell
bash pika install
```

Run application tests.

```shell
bash pika test
```
