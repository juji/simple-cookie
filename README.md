#RESERVED

#simple-cookie
simple cookie serializer & parser for node.js

##install
npm install simple-cookie


#usage
```javascript
var cookie = require('simple-cookie');

var cookieObject = {
	name: 'cookieName',
	value: 'cookie value',
	expires: (new Date()).valueOf() + 500000,
	path: '/',
	domain: 'domain.com',
	httponly: false,
	secure: true
}
```
What is `cookieObject`:

**name** `String` : cookie name

**value** `String` : cookie value

**expires** `DateString | Number | Date` (optional) : expire date

**path** `DateString | Number | Date` (optional) : cookie path, defaults to `/`

**domain** `String` (optional) : cookie domain 

**httponly** `Boolean` (optional) : defaults to `false`

**secure** `Boolean` (optional) : defaults to `false`

##methods
```javascript
var cookieString = cookie.stringify( cookieObject );
# cookieName=cookie%20value; Expires: dateString; Max-Date: Number; Path=/; domain=domain.com; secure


cookie.parse( cookieString  [, defaultPath]  [, defaultDomain]  );
# will create object like the 'cookieObject'


cookie.tokenize([
	{name:'cookie1','cvalue1'},
	{name:'cookie2','cvalue2'},
	{name:'cookie3','cvalue3'}
]);
# cookie1=cvalue1; cookie2=cvalue2; cookie3=cvalue3 
```


chhers,

[jujiyangasli.com](http://jujiyangasli.com)
