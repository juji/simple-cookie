/** da CookieObject. */
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
 * Cookie
 * testing
 *
 * @module
 */
declare const simpleCookie: {
    /**
     * From a CookieObject, returns string.
     * @param obj the CookieObject
     * @returns a cookie string
     * */
    stringify: (obj: CookieObject) => string;
    /**
     * From a string, returns CookieObject.
     * @param string the string
     * @param path the path to use in CookieObject
     * @param domain the domain to use in CookieObject
     * @returns CookieObject
     * */
    parse: (string: string, path?: string, domain?: string) => CookieObject;
    /**
     * Tokenize CookieObject.
     * @param array array of CookieObject
     * @returns Tokenized cookies
     * */
    tokenize: (array: CookieObject[]) => string;
};

export { simpleCookie };
