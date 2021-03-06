'use strict';

// we add a method to array to make sure we aren't sensitive to Array updates.
Array.prototype.badness = function () {
};

var PropTypes = require('prop-types');

var createAction = require('./index');

var test = require('tape');

test('It can be required', function (t) {
    t.equal(typeof createAction, 'function', 'create should be a function');

    t.end();
});

test('action with no arguments', function (t) {

    var myActionCreator = createAction('MY_ACTION_TYPE');
    t.equal(typeof myActionCreator, 'function',
        'an action function is created');

    var myAction = myActionCreator();
    t.deepEqual(myAction, { type: 'MY_ACTION_TYPE' },
        'creates an action which just has the type set');

    var error = new Error('My error!');
    var myErrorAction = myActionCreator(error);
    t.deepEqual(myErrorAction, {
        type: 'MY_ACTION_TYPE',
        error: true,
        payload: error
    }, 'has the correct schema');

    t.end();
});

test('action with one optional argument', function (t) {
    var myActionCreator = createAction('MY_ACTION_TYPE',  {
        foo: PropTypes.string
    });
    t.equal(typeof myActionCreator, 'function',
        'an action function is created');

    var myAction = myActionCreator('bar');
    t.deepEqual(myAction, {
        type: 'MY_ACTION_TYPE',
        payload: {foo:'bar'}
    }, 'we get back the expected action object for the argument');

    var myAction = myActionCreator();
    t.deepEqual(myAction, {
        type: 'MY_ACTION_TYPE',
        payload: {}
    }, 'we get back the expected action object without an argument');

    t.end();
});

test('action with one argument', function (t) {

    var myActionCreator = createAction('MY_ACTION_TYPE',  {
        foo: PropTypes.string.isRequired
    });
    t.equal(typeof myActionCreator, 'function',
        'an action function is created');

    var myAction = myActionCreator('bar');
    t.deepEqual(myAction, {
        type: 'MY_ACTION_TYPE',
        payload: {foo:'bar'}
    }, 'we get back the expected action object for the required argument');

    var error = new Error('My error!');
    var myErrorAction = myActionCreator(error);
    t.deepEqual(myErrorAction, {
        type: 'MY_ACTION_TYPE',
        error: true,
        payload: error
    }, 'has the correct schema');

    t.throws(function() {
        myActionCreator();
    }, 'creating an action with bad arguments should throw');

    t.end();
});

test('action with many arguments', function (t) {

    var myActionCreator = createAction('MY_ACTION_TYPE',  {
        foo: PropTypes.string.isRequired,
        baz: PropTypes.number
    });
    t.equal(typeof myActionCreator, 'function',
        'an action function is created');

    var myAction = myActionCreator({foo: 'bar'});
    t.deepEqual(myAction, {
        type: 'MY_ACTION_TYPE',
        payload: {foo:'bar'}
    }, 'we get back the expected action object for the required argument');

    var myAction = myActionCreator({foo: 'bar', baz: 8});
    t.deepEqual(myAction, {
        type: 'MY_ACTION_TYPE',
        payload: {foo:'bar', baz:8}
    }, 'we get back the expected action object');

    var error = new Error('My error!');
    var myErrorAction = myActionCreator(error);
    t.deepEqual(myErrorAction, {
        type: 'MY_ACTION_TYPE',
        error: true,
        payload: error
    }, 'passing an error creates an action with error payload and error flag');

    t.throws(function() {
        myActionCreator({foo: 'bar', baz: 'baz'});
    }, 'creating an action with bad arguments should throw');

    t.end();
});

test('error has appropriate message', function (t) {
    t.plan(1);
    try {
        var myActionCreator = createAction('MY_ACTION_TYPE',  {
            foo: PropTypes.string.isRequired
        });
        myActionCreator();
    } catch (e) {
        t.equal(e.message, 'The prop `foo` is marked as required in `MY_ACTION_TYPE`, but its value is `undefined`.', 'message matches');
    }
});
