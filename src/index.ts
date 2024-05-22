/**
 * Simple cookie parser & serializer
 * 
 * @example Usage
 * ```ts
 * 
 * import { stringify, parse, tokenize } from 'simple-cookie';
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


/** This function returns Expiry date in the format of Expires=;Max-Age=. */
function printExpires(expires: string|number|Date|boolean): string | false {
  if(!expires) return false;
  let date = new Date();
  if(typeof expires === 'string') date = new Date(expires);
  if(typeof expires === 'number') date = new Date(expires);
  return 'Expires='+date.toUTCString()+';Max-Age='+Math.round(
      ( date.valueOf() - (new Date()).valueOf() ) / 1000
  );
}

/** 
 * The CookieObject. 
 * */
export type CookieObject = {
  name: string
  value: string
  expires?: string | number | Date | boolean
  path?: string
  domain?: string
  httponly?: boolean
  secure?: boolean
  samesite?: String
}


/** 
 * From a CookieObject, returns string. 
 * @param obj the {@linkcode CookieObject}
 * @returns a cookie string
 * */
export function stringify( obj: CookieObject ): string{
    let value;
    try{
        value = encodeURIComponent(obj.value);
    }catch(e){
        value = obj.value;
    }
    return [

        obj.name+'='+value,
        ( typeof obj.expires !== 'undefined' && obj.expires ? printExpires(obj.expires) : '' ),
        ( typeof obj.path !== 'undefined' ? (obj.path ? 'Path='+obj.path : '') : 'Path=/' ),
        ( typeof obj.domain !== 'undefined' && obj.domain ? 'Domain='+obj.domain : '' ),
        ( typeof obj.secure !== 'undefined' && obj.secure ? 'secure' : '' ),
        ( typeof obj.httponly !== 'undefined' && obj.httponly ? 'HttpOnly' : '' ),
        ( typeof obj.samesite !== 'undefined' && obj.samesite ? 'SameSite=' + obj.samesite : '')

    ].join(';').replace(/;+/g,';').replace(/;$/,'').replace(/;/g,'; ');
}

/** 
 * From a string, returns {@linkcode CookieObject}. 
 * @param string the string
 * @param path the path to use in {@linkcode CookieObject}
 * @param domain the domain to use in {@linkcode CookieObject}
 * @returns {@linkcode CookieObject}
 * */
export function parse( string: string, path?: string, domain?: string ):CookieObject{

    const s = string.replace(/;\s+/g,';').split(';')
        .map((s: string) => s.replace(/\s+\s+/g,'=').split('='));

    let n = s.shift();
    if(!n) throw new Error('malformed cookie')

    const obj: CookieObject = {
        name: '',
        value: '',
        expires: false,
        httponly: false,
        secure: false,
        path: path || '/',
        domain: domain || '',
        samesite: '',
    };

    const f = {
        httponly(){ obj.httponly = true; },
        secure(){ obj.secure = true; },
        expires(v: string | Date ){ obj.expires = new Date(v); },
        'max-age'(v : number){ 
            if(obj.expires) return; 
            obj.expires = new Date((new Date()).valueOf()+(v*1000)); 
        },
        path(v: string){ obj.path = v; },
        domain(v: string){ obj.domain = v; },
        samesite(v: string) { obj.samesite = v; }
    };
    
    let I: string;
    for(let i in s) {
        I = s[i][0].toLowerCase();
        if( typeof f[I] !== 'undefined' ) f[I]( s[i].length==2 ? s[i][1] : '' );
    }

    if( !obj.expires ) obj.expires = 0;
    obj.name = n.shift() || '';
    if(!obj.name) throw new Error('cookie name is empty')
    n = n.map((s: string) => {
        let fi: string;
        try{
        fi = decodeURIComponent(s)
        }catch(e){ fi = s }
        return fi
    })
    
    obj.value = n.join('=');
    return obj;
}

/** 
 * Tokenize {@linkcode CookieObject}s. 
 * @param array array of {@linkcode CookieObject}s
 * @returns Tokenized cookies
 * */
export function tokenize( array: CookieObject[] ): string{
    return array.map((s) => s.name+'='+s.value).join('; ');
}
