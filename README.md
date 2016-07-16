react-safe-actions
==================
[![NPM Version](http://img.shields.io/npm/v/react-safe-actions.svg?style=flat)](https://www.npmjs.com/package/react-safe-actions)
[![Build Status](https://travis-ci.org/thaggie/react-safe-actions.svg)](https://travis-ci.org/thaggie/react-safe-actions)
[![Dependencies Status](https://david-dm.org/thaggie/react-safe-actions.svg)](https://david-dm.org/thaggie/react-safe-actions)

A library for declaratively creating [flux standard actions](https://github.com/acdlite/flux-standard-action)
that check the payload type using [React](https://facebook.github.io/react)'s `PropTypes` system.

Flux standard actions are of the form:

``` json
{
  "type": "ADD_TODO",
  "payload": {
    "text": "Do something."  
  }
}
```

With `react-safe-actions` you'd create a function to create the action like this:

``` js
var rsa = require('react-safe-actions');
var doSomething = rsa.create('ADD_TODO', {
	text: rsa.types.string.isRequired
});
```

And you'd call it like this:

``` js
dispatch(doSomething('Do something.'));
```

Action payloads are validated to make sure they conform to the payload's schema
at construction time, when the schema isn't satisfied an exception is thrown:

![Error: Required prop `id` was not specified in `EDIT_TODO`.](react-safe-actions-error-log.png)

Note that the checking is turned off if `NODE_ENV` is set to `production`.

## Usage Examples

### No Arguments
``` js
var noArgsAction = rsa.create('NO_ARGS');
noArgsAction();
// {type: 'NO_ARGS'}
```

### One Argument

Actions with one argument are special cased so that they can just be called with that one argument rather than the payload options:

``` js
var oneArgAction = rsa.create('ONE_ARG', {
	foo: rsa.types.string.isRequired
});
oneArgAction('the arg for foo');
// {type: 'ONE_ARG': payload: {foo: 'the arg for foo'}}
oneArgAction(); // throws
```

### More than one argument

``` js
var multiArgAction = rsa.create('MANY_ARGS', {
	foo: rsa.types.string.isRequired,
	bar: rsa.types.string.isRequired
});
multiArgAction({foo: 'the foo arg', bar: 'the bar arg'});
// {type: 'MANY_ARGS', payload: {foo: 'the foo arg', bar: 'the bar arg'}}
multiArgAction({foo: 'the foo arg'}); // throws
```

### With an error

``` js
var anyArgs = rsa.create('ANY_ARGS', {
	foo: rsa.types.string.isRequired,
	bar: rsa.types.string.isRequired
});
anyArgs(new Error('Badness'));
// {type: 'ANY_ARGS', error: true payload: Error('Badness')}
```


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
