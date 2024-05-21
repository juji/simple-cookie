
/** This function returns Expiry date in the format of Expires=;Max-Age=. */
function printExpires(expires: string|number|Date|boolean){
  if(!expires) return false;
  let date = new Date();
  if(typeof expires === 'string') date = new Date(expires);
  if(typeof expires === 'number') date = new Date(expires);
  return 'Expires='+date.toUTCString()+';Max-Age='+Math.round(
      ( date.valueOf() - (new Date()).valueOf() ) / 1000
  );
}

/** da CookieObject. */
type CookieObject = {
  name: string
  value: string
  expires?: string | number | Date | boolean
  path?: string
  domain?: string
  httponly?: boolean
  secure?: boolean
  samesite?: String
}

const cookie = {

    /** 
     * From a CookieObject, returns string. 
     * @param obj the CookieObject 
     * */
    stringify: function( obj: CookieObject ): string{
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
  },

    /** 
     * From a string, returns CookieObject. 
     * @param string the string
     * @param path the path to use in CookieObject
     * @param domain the domain to use in CookieObject
     * */
    parse: function( string: string, path: string, domain: string ):CookieObject{

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
  },

    /** 
     * Tokenize CookieObject. 
     * @param array array of CookieObject
     * */
    tokenize: function( array: CookieObject[] ): string{
        return array.map((s) => s.name+'='+s.value).join('; ');
    }
};

export default cookie

