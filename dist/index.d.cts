/**
 * Simple cookie parser & serializer
 *
 * @example Usage
 * ```ts
 *
 * import {
 *  type CookieObject,
 *  stringify, parse, tokenize
 * } from '@juji/simple-cookie';
 *
 * const cookieObject = {
 *	name: 'cookieName',
 *	value: 'cookie value',
 *	expires: (new Date()).valueOf() + 500000,
 *	path: '/',
 *	domain: 'domain.com',
 *	httponly: false,
 *	secure: true,
 *	samesite: 'None'
 * }
 *
 * const cookie: string = stringify( cookieObject );
 * // cookieName=cookie%20value; Expires: Sat, 15-Aug-2015 17:41:05 GMT; Max-Age: 31449600; Path=/; domain=domain.com; secure; samesite=None
 *
 *
 * const cookieObject: CookieObject = parse( cookieString  [, defaultPath]  [, defaultDomain]  );
 * // will create object like the 'cookieObject'
 *
 *
 * const tokens: string = tokenize([
 * 	{name:'cookie1', value: 'cvalue1'},
 * 	{name:'cookie2', value: 'cvalue2'},
 * 	{name:'cookie3', value: 'cvalue3'}
 * ]);
 * // cookie1=cvalue1; cookie2=cvalue2; cookie3=cvalue3
 *
 * ```
 *
 * checkout the [SameSite attribute](https://web.dev/articles/samesite-cookies-explained).
 *
 * @module
 */
/**
 * The CookieObject.
 * */
type CookieObject = {
    name: string;
    value: string;
    expires?: string | number | Date | boolean;
    path?: string;
    domain?: string;
    httponly?: boolean;
    secure?: boolean;
    samesite?: String;
};
/**
 * From a CookieObject, returns string.
 * @param obj the CookieObject
 * */
declare function stringify(obj: CookieObject): string;
/**
 * From a string, returns CookieObject.
 * @param string the string
 * @param path the path to use in CookieObject
 * @param domain the domain to use in CookieObject
 * @returns {@linkcode CookieObject}
 * */
declare function parse(string: string, path?: string, domain?: string): CookieObject;
/**
 * Tokenize CookieObjects.
 * @param array array of CookieObjects
 * @returns Tokenized cookies
 * */
declare function tokenize(array: CookieObject[]): string;

export { type CookieObject, parse, stringify, tokenize };
