# Histone - cross-platform template engine&nbsp;&nbsp;[![Build Status](https://travis-ci.org/MegafonWebLab/histone-javascript.svg?branch=master)](https://travis-ci.org/MegafonWebLab/histone-javascript)&nbsp;[![npm version](https://badge.fury.io/js/histone.svg)](https://npmjs.org/package/histone)

[![NPM](https://nodei.co/npm/histone.png?downloads=true&stars=true&downloadRank=true)](https://nodei.co/npm/histone/)

- [Histone documentation home](https://github.com/MegafonWebLab/histone-documentation)
- [Histone reference](https://github.com/MegafonWebLab/histone-documentation/wiki)
- [JavaScript reference](../../wiki)

### Node.js® installation

```bash
npm install histone
```

In case if you do it for production, don't forget to tune it (see description below):

```bash
npm install histone
cd node_modules/histone/build
npm install
node build.js --format=commonjs --exclude-parser
```

It works absolutely the same way even if you specify Histone as a project dependency in your package.json file:

```json
{
    "dependencies": {
        "histone": "latest"
    }
}
```

And then the production build would look like:

```bash
npm install
cd node_modules/histone/build
npm install
node build.js --format=commonjs --exclude-parser
```

### Running tests

In case if you wish to build some feature or just play around with it, you can run tests in order to see if your changes breaks something important:

```bash
cd node_modules/histone/test
npm install
node test.js
```

By default tests are executed against source code (node_modules/histone/src/Histone.js) , to change that (testing custom build), pass --histone flag:

```bash
cd node_modules/histone/test
npm install
node test.js --histone=../Histone.js
```

If you want to run specific test, pass --suite flag:

```bash
cd node_modules/histone/test
node test.js --suite=MyTestSuite.js
```

### Building production package from source code

When you need to use Histone in the web - browser, you can prepare special package in required format, first of all you'll need to install Node.js® version of Histone as it's described above, then do the following:

```bash
cd node_modules/histone/build/
npm install
node build.js [options]
```

Where options are:

* **--verbose** - display messages during the build
* **--exclude-parser** - don't include Parser into production package
* **--format=_FORMAT_** - where **_FORMAT_** is one of the following:
  * **_global_** - makes package where Histone is exported into the global variable
  * **_amd_** - makes AMD - compatible package
  * **_commonjs_** - just merges all original source files into one huge CommonJS module (**default**)
* **--lang=_LANGUAGE_** - where **_LANGUAGE_** is the path to the language file (see i18n folder for example)
* **--defaultLang=_LANGUAGE_** - specify language that will be used by default
* **--target=PATH** - path to target file (default will be node_modules/histone/Histone.js)

For example if you need Histone as AMD module with Russian and English languages you'll do the following:

```bash
npm install histone
cd node_modules/histone/build/
npm install
node build.js --format=amd --lang=../i18n/ru.js --lang=../i18n/en.js --defaultLang=ru
```

Production package build for the web - browser might look somewhat like this:

```bash
npm install histone
cd node_modules/histone/build/
npm install
node build.js --format=amd --lang=../i18n/ru.js --exclude-parser
```

### Using template engine

When you connect Histone to your project (no matter if it's Node.js® or browser), you'll use it something like this:

```javascript
var Histone = require('histone');
Histone('2 x 2 = {{2 * 2}}').render(function(result) {
    console.info(result);
});
```

of course soon or late you'll want to load template from the file, in this case you'll have to set up resource loader which will be responsible for loading templates:

```javascript
var FS = require('fs'),
    Histone = require('histone');

Histone.setResourceLoader(function(uri, ret) {
    console.info('[ LOADING ]', uri);
    FS.readFile(uri, 'UTF-8', function(error, result) {
        ret(result);
    });
});

Histone('{{loadText("test.txt")}}').render(function(result) {
    console.info(result);
});
```

### Returning and passing raw JavaScript values from and to the template

Most of the time you'll use Histone for text generation, but sometimes it's necessary for the template to return some raw JavaScript value, Histone will do the conversion between internal data types and JavaScript data types for you:

```javascript
require('histone')('{{return /regexp/ig}}').render(function(result) {
    // Histone RegExp automatically converted into JavaScript RegExp
    console.info(result instanceof RegExp);
});
```

Same way you can pass any previously registered JavaScript object to the template's context:

```javascript
require('histone')('{{return this->isRegExp}}').render(function(result) {
    // JavaScript RegExp automatically converted into Histone RegExp
    // then Histone Boolean automatically converted into JavaScript Boolean
    console.info(result, typeof result === 'boolean');
}, /regexp/ig);
```

This trick works with any data type recognized by Histone, i. e. [Histone.Undefined](../../wiki/Histone.Undefined) <-> JavaScript undefined, [Histone.Null](../../wiki/Histone.Null) <-> JavaScript null and so on. [Histone.Array](../../wiki/Histone.Array) will be automatically converted into JavaScript Array or JavaScript Object, depends on the array contents:

```javascript
// return Array
require('histone')('{{return [1, 2]}}').render(function(result) {
    // JavaScript Array
    console.info(result instanceof Array);
});

// return Object
require('histone')('{{return [foo: 1, bar: 2]}}').render(function(result) {
    // JavaScript Object
    console.info(result instanceof Object);
});
```

[Histone.Date](../../wiki/Histone.Date) will be automatically converted into JavaScript date, and vice versa:

```javascript
// return JavaScript Date
require('histone')('{{return getDate}}').render(function(result) {
    // JavaScript Date
    console.info(result instanceof Date);
});

// JavaScript Date will be automatically converted into HistoneDate
require('histone')('{{this->isDate}}').render(function(result) {
    // true
    console.info(result);
}, new Date);
```

[Histone.Macro](../../wiki/Histone.Macro) will be automatically converted into JavaScript function, but JavaScript function will never be converted into [Histone.Macro](../../wiki/Histone.Macro) when passed as template's context:

```javascript
// return Function
require('histone')('{{return => 2 * 2}}').render(function(result) {
    // JavaScript Function
    console.info(result instanceof Function, result());
});

// JavaScript function will never be converted into HistoneMacro
require('histone')('{{return this->isMacro}}').render(function(result) {
    // false
    console.info(result);
}, function(){});
```

#### Managing return type produced by render

If you need Histone data type instead of it's JavaScript equivalent as a result of template rendering, you can convert it using [Histone.toHistone](../../wiki/Histone.toHistone):

```javascript
require('histone')('{{return [1, 2, 3]}}').render(function(result) {
    // true
    console.info(result instanceof Array);
    // convert JavaScript Array into Histone.Array
    result = Histone.toHistone(result);
    // true
    console.info(result instanceof Histone.Array);
});
```

or you can specify return type explicitly:

```javascript
require('histone')('{{return [1, 2, 3]}}').render(function(result) {
    // true
    console.info(result instanceof Histone.Array);
}, Histone.R_HISTONE);
```

Sometimes it's required to have string as a result of template rendering (for example you use rendering result as a server response in the web - application), obviously you can check and convert result yourself:

```javascript
require('histone')('{{return [1, 2, 3]}}').render(function(result) {
    // check and convert result if it's not a string
    if (typeof result !== 'string') result = Histone.toString(result);
    // ...
});
```

or you can specify explicit stringification:

```javascript
require('histone')('{{return [1, 2, 3]}}').render(function(result) {
    // string
    console.info(typeof result);
}, Histone.R_STRING);
```

### Extending template runtime

You can assign new methods (or overwrite existing ones) to any of the Histone built - in data types, using [Histone.register](../../wiki/Histone.register) method:

```javascript
Histone.register(PROTOTYPE, MEMBER_NAME, MEMBER_VALUE);
```

Where PROTOTYPE is one of the following:

* [Histone.Base.prototype](../../wiki/Histone.Base) - base data type for any Histone value
* [Histone.Undefined.prototype](../../wiki/Histone.Undefined) - Undefined data type
* [Histone.Null.prototype](../../wiki/Histone.Null) - Null data type
* [Histone.Boolean.prototype](../../wiki/Histone.Boolean) - Boolean data type (in fact JavaScript Boolean)
* [Histone.Number.prototype](../../wiki/Histone.Number) - Number data type (in fact JavaScript Number)
* [Histone.String.prototype](../../wiki/Histone.String) - String data type (in fact JavaScript String)
* [Histone.RegExp.prototype](../../wiki/Histone.RegExp) - RegExp data type (in fact JavaScript RegExp)
* [Histone.Array.prototype](../../wiki/Histone.Array) - Array data type
* [Histone.Date.prototype](../../wiki/Histone.Date) - Date data type
* [Histone.Macro.prototype](../../wiki/Histone.Macro) - Macro data type
* [Histone.Global.prototype](../../wiki/Histone.Global) - Global object

Here are couple of simple examples that will give you some understading:

```javascript
var Histone = require('histone');

// create global method
Histone.register(Histone.Global.prototype, 'hello', function(self, args) {
    return 'Hello ' + args[0] + '!';
});

// test our brand new method
Histone('{{hello("world")}}').render(function(result) {
    console.info(result);
});
```

Same thing goes for any other valid Histone data type, i. e. you can introduce new methods for Strings, Numbers, Arrays and so on, the idea is that if you miss something you just add it yourself:

```javascript
var Histone = require('histone');

// create global method
Histone.register(Histone.String.prototype, 'doSomethingWeird', function(self) {
    return self.split('').sort().join('');
});

// test our brand new method
Histone('{{"bla-bla"->doSomethingWeird}}').render(function(result) {
    console.info(result);
});
```

Third argument to [Histone.register](../../wiki/Histone.register) not necessary should be a function, it can be anything recognized by Histone, automatic conversion will be applied if needed:

```javascript
var Histone = require('histone');

// method that returns string
Histone.register(Histone.Global.prototype, 'myStringMethod', 'myStringValue');

// method that returns array, JavaScript array will be automatically converted into HistoneArray
Histone.register(Histone.Global.prototype, 'myArrayMethod', [1, 2, 3]);

// test it
Histone('{{myStringMethod}}').render(function(result) {
    // myStringValue
    console.info(result);
});

// test it
Histone('{{myArrayMethod->toJSON}}').render(function(result) {
    // [1,2,3]
    console.info(result);
});
```

#### Returning self value

In some situations it's required for the method to return the value itself, usually you would solve it somewhat like this:

```javascript
var Histone = require('histone');
// register String method which returns string itself
Histone.register(Histone.String.prototype, 'getSelf', function(self) {
    return self;
});
// myString
console.info(Histone.invoke('myString', 'getSelf'));
```

This looks a bit stupid to create a whole function which does nothing but returning it's first argument. If you care about such things, use [Histone.R_SELF](../../wiki/Histone.register#using-histoner_self-to-specify-that-method-returns-the-value-itself) instead of function in such situations:

```javascript
var Histone = require('histone');
// register String method which returns string itself
Histone.register(Histone.String.prototype, 'getSelf', Histone.R_SELF);
// myString
console.info(Histone.invoke('myString', 'getSelf'));
```

#### Handling arguments

Arguments to the called method are passed as an array in the second argument:

```javascript
var Histone = require('histone');

// create global method
Histone.register(Histone.Global.prototype, 'getArgsCount', function(self, args) {
    return args.length;
});

// test it
Histone('{{getArgsCount(1, 2, 3)}}').render(function(result) {
    // 3
    console.info(result);
});
```

#### Asynchronous methods

In order to support asynchronous processing, just define method handler as a function with at least 4 arguments:

```javascript
var Histone = require('histone');

// method that waits 1 second and returns string
Histone.register(Histone.Global.prototype, 'myDelay', function(self, args, scope, ret) {
    setTimeout(function() {
       ret('WAITED 1000ms');
    }, 1000);
});

Histone('{{myDelay}}').render(function(result) {
    // WAITED 1000ms
    console.info(result);
});
```

#### Introducing new data types

Native JavaScript classes can also be easily introduced to Histone, let's create a wrapper for JavaScript Date object:

```javascript
var Histone = require('histone');

// create global method which returns Date instance
Histone.register(Histone.Global.prototype, 'getMyDate', function() {
    return new Date;
});

// we have to register at least one method for the Date.prototype, so Histone can recognize it
Histone.register(Date.prototype, 'toString', function(self) {
    // self refers to the Date instance here
    return self.toString();
});

// test our Date wrapper
Histone('now is {{getMyDate}}').render(function(result) {
    console.info(result);
});
```

#### Returning values from the templates

Once we've registered the type, we can return it from the template:

```javascript
var Histone = require('histone');

// create global method which returns Date instance
Histone.register(Histone.Global.prototype, 'getMyDate', function() {
    return new Date;
});

// we have to register at least one method for the Date.prototype, so Histone can recognize it
Histone.register(Date.prototype, 'toString', function(self) {
    // self refers to the Date instance here
    return self.toString();
});

// test our Date wrapper
Histone('{{return getMyDate}}').render(function(result) {
    console.info(result instanceof Date);
});
```

#### Handling internal Histone data types

Note that when you extending Histone, your method handlers will have to deal with internal Histone data types, not their JavaScript equivalents:

```javascript
var Histone = require('histone');

// create global method which returns true if it's argument is an array
Histone.register(Histone.Global.prototype, 'myIsArray', function(self, args) {
    // note that first argument here is not JavaScript Array
    return (args[0] instanceof Histone.Array);
});

Histone('{{myIsArray([1, 2, 3])}}').render(function(result) {
    // true
    console.info(result);
});
```

If you don't care about internal Histone type, you can easily convert the value you receive in your method handler into native JavaScript value:

```javascript
var Histone = require('histone');

// create global method which returns true if it's argument is an array
Histone.register(Histone.Global.prototype, 'myIsArray', function(self, args) {
    var arg = Histone.toJavaScript(args[0]);
    // note that first argument here is not JavaScript Array
    return (arg instanceof Array);
});

Histone('{{myIsArray([1, 2, 3])}}').render(function(result) {
    // true
    console.info(result);
});
```

Second possibility is to explicitly specify desired argument type when registering method:

```javascript
var Histone = require('histone');

// create global method which returns true if it's argument is a JavaScript Date
Histone.register(Histone.Global.prototype, 'myIsDate', function(self, args) {
    return (args[0] instanceof Date);
}, Histone.R_JS);

// passing JavaScript Date, result = true
console.info(Histone.invoke(Histone.global, 'myIsDate', new Date));
// passing Histone Date, result = true
console.info(Histone.invoke(Histone.global, 'myIsDate', new Histone.Date));
```

Most of Histone data types are simple references to the JavaScript data types, however it's recommended to use Histone.Type instead of it's JavaScript equivalent in order to be compatible with the future releases:

```javascript
var Histone = require('histone');

// create global method which returns true if it's argument is a RegExp
Histone.register(Histone.Global.prototype, 'myIsRegExp', function(self, args) {
    // this will be true, however it's recommended to use Histone.RegExp instead
    return (args[0] instanceof RegExp);
});

Histone('{{myIsRegExp(/regexp/)}}').render(function(result) {
    // true
    console.info(result);
});
```

#### Using Histone macros as callback functions

Sometimes you need to pass Histone macro as a callback in your custom method, then call it based on some condition:

```javascript
var Histone = require('histone');

Histone.register(Histone.Global.prototype, 'myMethod', function(self, args, scope, ret) {
    var arg = args[0];
    if (arg instanceof Histone.Macro)
        arg.call([1, 2, 3], scope, ret);
    else ret();
});

Histone('{{myMethod(=> self.arguments->toJSON)}}').render(function(result) {
    // [1,2,3]
    console.info(result)
});
```

#### Extending Histone data types

You can extend Histone data types and provide your own version of Array, Macro and so on, note that this won't work for the things like String, Number, RegExp and so on, because most of the current JavaScript engines won't allow you to extend native JavaScript objects, but this might change in the future, so for now it will really work only for Arrays and Macros:

```javascript
var Histone = require('histone');

// create our version of Array
var MyArray = function() { Histone.Array.apply(this, arguments); };
MyArray.prototype = Object.create(Histone.Array.prototype);
MyArray.prototype.constructor = MyArray;
MyArray.prototype.test = function() { return 'MyArray.prototype.test'; };

// define some method for our version of Array, otherwise Histone won't recognize it
Histone.register(MyArray.prototype, 'test', function(self) {
    // call method test on MyArray instance
    return self.test();
});

// register global method wich will return MyArray instance
Histone.register(Histone.Global.prototype, 'getMyArray', function(self) {
    return new MyArray;
});

// test it
Histone('{{getMyArray->test}}').render(function(result) {
    // MyArray.prototype.test
    console.info(result);
});
```

### Converting internal Histone data types into native JavaScript data types

When you're extending Histone and writing custom method handlers, you have to deal with internal Histone data types, however sometimes you don't need it and instead of working with internals, you prefer to convert them into JavaScript values, in this case there are couple of methods that you might find useful:

* [Histone.toJavaScript](../../wiki/Histone.toJavaScript) - converts Histone value into a JavaScript value if converter is registered (see [Histone.M_TOJS](../../wiki/Histone.toJavaScript#register-custom-histonem_tojs-virtual-method))
* [Histone.toBoolean](../../wiki/Histone.toBoolean) - converts Histone value into a JavaScript Boolean
* [Histone.toString](../../wiki/Histone.toString) - converts Histone value into a JavaScript String
* [Histone.toNumber](../../wiki/Histone.toNumber) - converts Histone value into a JavaScript Number
* [Histone.toJSON](../../wiki/Histone.toJSON) - converts Histone value into a JSON String

```javascript
var Histone = require('histone');

// register global method to test conversion utils
Histone.register(Histone.Global.prototype, 'myIsArray', function(self, args) {
    // JavaScript Array
    console.info('toJavaScript', Histone.toJavaScript(args[0]));
    // true
    console.info('toBoolean', Histone.toBoolean(args[0]));
    // 1 2 3
    console.info('toString', Histone.toString(args[0]));
    // [1,2,3]
    console.info('toJSON', Histone.toJSON(args[0]));
    // 1
    console.info('toNumber', Histone.toNumber(true));
});

Histone('{{myIsArray([1, 2, 3])}}').render(function(result) {
    // ...
});
```

### Calling Histone methods internally

Sometimes it's necessary to perform method call internally (for example in the method handler when extending the engine), in this case you can use [Histone.invoke](../../wiki/Histone.invoke) method:

```javascript
var Histone = require('histone');

Histone.register(Histone.Global.prototype, 'myMethod', function(self, args, scope) {
    // value, member, arguments array, scope, callback function
    Histone.invoke('string', 'split', function(result) {
        console.info(result instanceof Histone.Array)
    });
});

Histone('{{myMethod}}').render(function(result) {
    // ...
});
```

Btw this can be done even without templates, rendering and so on, check it out:

```javascript
var Histone = require('histone');
// same as {{"string"->split}} in Histone template
console.info(Histone.invoke('string', 'split'));
```

Arguments will be converted into Histone data types automatically:

```javascript
var Histone = require('histone');
// JavaScript Array will be converted into HistoneArray automatically
// result will be "1.2.3.4"
console.info(Histone.invoke([1, 2, 3, 4], 'join', '.'));
```

Calling methods of the Histone's Global object is also as simple as this:

```javascript
var Histone = require('histone');
// Histone.global holds instance of Histone.Global.prototype
// 1
console.info(Histone.invoke(Histone.global, 'getMin', [1, 2, 3, 4]));
// 4
console.info(Histone.invoke(Histone.global, 'getMax', [1, 2, 3, 4]));
```

You might notice already that in some situations there is a callback function which receives the result of the method call, but sometimes [Histone.invoke](../../wiki/Histone.invoke) returns the result directly without callback, what's the difference? Basically the idea is following, if you know what you calling, and you sure that the method you call is synchronous, then use [Histone.invoke](../../wiki/Histone.invoke) without callback, otherwise always use [Histone.invoke](../../wiki/Histone.invoke) in it's asynchronous form. For example, it's known that Array->join is synchronous, so you can safely call it synchronously, but if that wouldn't be truth (or you don't know it) then call it asynchronously, that won't fail in any case:

```javascript
var Histone = require('histone');
// call Array->join synchronously
console.info(Histone.invoke([1, 2, 3, 4], 'join', '.'));
// call Array->join asynchronously
Histone.invoke([1, 2, 3, 4], 'join', '.', null, function() {
    console.info(result);
});
```

So for the information about built-in methods and preferred way to call them, refer to [API](https://github.com/MegafonWebLab/histone-javascript/wiki) documentation, 3rd - party documentation or just call them asynchronously if you've got no idea about them.

#### Handling return data types

By default, [Histone.invoke](../../Histone.invoke) (no matter whenever you call it synchronously or not) will return value represented as Histone data type, in most situations it's ok, but sometimes it's better to work with JavaScript data types, if that so, you have two possible solutions. First one is to convert the value returned by [Histone.invoke](../../wiki/Histone.invoke) using [Histone.toJavaScript](../../wiki/Histone.toJavaScript):

```javascript
var result, Histone = require('histone');
// Histone data type
console.info(result = Histone.invoke('string', 'split'));
// JavaScript data type
console.info(result = Histone.toJavaScript(result));
```

To make it even shorter, here comes the second variant, specify return type explicitly:

```javascript
var Histone = require('histone');
// JavaScript data type
console.info(Histone.invoke('string', 'split', Histone.R_JS));
```

#### Calling method on prototypes

In some situations, when you're using native JavaScript prototype inheritance, you might need to be able to call method on the parent class / prototype (call super). For example, you've extended [Histone.Array](../../wiki/Histone.Array) in order to make your own Array with blackjack and hookers:

```javascript
var Histone = require('histone');

// create our version of Array
var MyArray = function() { Histone.Array.apply(this, arguments); };
MyArray.prototype = Object.create(Histone.Array.prototype);
MyArray.prototype.constructor = MyArray;

// "override" Histone.Array->toString method with own implementation
Histone.register(MyArray.prototype, 'toString', function(self) {
    // hide the secret
    return '(SECRET_CONTENT)';
});
```

Now you want to call [Histone.Array](../../wiki/Histone.Array)->toString, in order to do that simply pass JavaScript - array, that consists of prototype and method name into [Histone.invoke](../../wiki/Histone.invoke):

```javascript
// "override" Histone.Array->toString method with own implementation
Histone.register(MyArray.prototype, 'toString', function(self, args) {
    // check if password valid
    if (args[0] === 'password') {
       // call original method
       return Histone.invoke(self, [Histone.Array.prototype, 'toString']);
    }
    // go away
    return '(SECRET_CONTENT)';
});

// define Global method that will return instance of MyArray
Histone.register(Histone.Global.prototype, 'getMyArray', function(self, args) {
    var result = new MyArray;
    result.set('very');
    result.set('secret');
    result.set('content');
    return result;
});

// (SECRET_CONTENT)
Histone('{{getMyArray->toString}}').render(console.info);
// very secret content
Histone('{{getMyArray->toString("password")}}').render(console.info);
```

### Magic methods

Second argument to [Histone.register](../../wiki/Histone.register) most of the time represents name of the registered method as a string, however there are some MAGIC methods that is used in special cases:

* [Histone.M_GET](../../wiki/Histone.register#using-histonem_get-to-specify-property-getter) - called in case of attempt to read value's property, acts as property getter
* [Histone.M_CALL](../../wiki/Histone.register#using-histonem_call-to-specify-call-handler) - called in case of attempt to call value as a method
* [Histone.M_TOJS](../../wiki/Histone.register#using-histonem_tojs-to-specify-tojavascript-convertor) - called when conversion to native JavaScript value is required

```javascript
var Histone = require('histone');

function MyObject() {
    this.internalObj = {
       foo: 'bar',
       bar: 'foo'
    };
}

// register property getter
Histone.register(MyObject.prototype, Histone.M_GET, function(self, args) {
    return self.internalObj[args[0]];
});

// register call handler
Histone.register(MyObject.prototype, Histone.M_CALL, function(self, args) {
    return 'MyObject instance called as method!';
});

// register convertor to native JavaScript value
Histone.register(MyObject.prototype, Histone.M_TOJS, function(self, args) {
    return 'NATIVE_JS_VALUE';
});

// register method that returns MyObject instance
Histone.register(Histone.Global.prototype, 'getMyObject', function(self, args) {
    return new MyObject;
});

Histone('{{getMyObject.foo}}').render(function(result) {
    // bar
    console.info(result);
});

Histone('{{getMyObject()()}}').render(function(result) {
    // MyObject instance called as method!
    console.info(result);
});

Histone('{{return getMyObject}}').render(function(result) {
    // NATIVE_JS_VALUE
    console.info(result);
});
```

### Converting templates into AST representation

Template source code is good when you're developing your project, but once you go in production, parsing templates from source code is unnecessary overhead, so before uploading production version of you project, you'll want to convert all your templates into intermediate AST form, which won't require parser and will allow templates to be executed way more faster. In this case you use [getAST](../../wiki/Template.getAST) method wich will return AST tree for the specified template source code:

```javascript
var Histone = require('histone');
var templateAST = Histone('10 x 2 = {{10 * 2}}').getAST();
```

There are plenty of useful Node.js® modules, so you can figure out yourself how to process project's file set and convert all found ".tpl" files into AST representation using code snippet provided above.

### Managing internal Histone cache

Results of call to Histone require, loadText, loadJSON method are cached by default, which means that the second call with the same argument will give you the same result as it was for the first time. It's good in the production (where nobody changes your templates), but it becomes a real problem in developement environment where template files are changed pretty frequent, so if you don't want to restart your server after each change in the template file you'll have to clear internal Histone cache on every change. In case if you don't want Histone to cache anything at all, simply turn off the cache before doing anything else:

```javascript
Histone.setCache(false);
```

But in combination with great [chokidar](https://github.com/paulmillr/chokidar) module and [Histone.clearCache](../../wiki/Histone.clearCache), you can solve it more cleaver way:

```javascript
// watch for changes in tpl files
chokidar.watch('**/*.tpl', {
    cwd: __dirname,
    ignoreInitial: true
})
// clear Histone cache on change
.on('all', Histone.clearCache);
```

### Performing network operations

Sometimes you need to load text - file, JSON - file or template in your JavaScript code the way you're doing in the template. Of course you can use [Histone.invoke](../../wiki/Histone.invoke) to do that, but there is more convenient ways of doing that: [Histone.loadText](../../wiki/Histone.loadText), [Histone.loadJSON](../../wiki/Histone.loadJSON) and [Histone.require](../../wiki/Histone.require). All of this methods are behaving exactly as they were called from the template or using [Histone.invoke](../../wiki/Histone.invoke), it means that network request goes through the resource loader set by [Histone.setResourceLoader](../../wiki/Histone.setResourceLoader) and internal caching mechanism.

```javascript
// load text file using template
Histone('{{return loadText("file.txt")}}').render(function(result) {
    console.info(result);
});

// load text file using Histone.invoke
Histone.invoke(Histone.global, 'loadText', 'file.txt', function(result) {
    console.info(result);
});

// load text file using Histone.loadText
Histone.loadText('file.txt', function(result) {
    console.info(result);
});
```

When loading JSON - file, using [Histone.loadJSON](../../wiki/Histone.loadJSON) it's important to realize that result will always be converted into Histone data type:

```javascript
// load JSON file using Histone.loadJSON
Histone.loadJSON('test.json', function(result) {
    // result might be Histone or JavaScript value
    console.info(result);
});
```

You can explicitly specify **Histone.R_JS** as desired result type:

```javascript
// load JSON file using Histone.loadJSON
Histone.loadJSON('test.json', function(result) {
    // result always JavaScript value
    console.info(result);
}, Histone.R_JS);
```

Same goes for require:

```javascript
// load and process template using Histone.require
Histone.require('test.tpl', function(result) {
    // result might be Histone or JavaScript value
    console.info(result);
});
```

If you explicitly specify **Histone.R_JS** as desired result type, then returned result will be converted into corresponding JavaScript value:

```javascript
// load and process template using Histone.require
Histone.require('test.tpl', function(result) {
    // result always JavaScript value
    console.info(result);
}, Histone.R_JS);
```

If you need string, set **Histone.R_STRING** as desired result type:

```javascript
// load and process template using Histone.require
Histone.require('test.tpl', function(result) {
    // result always string
    console.info(result);
}, Histone.R_STRING);
```
