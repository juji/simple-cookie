function printExpires(expires: string|number|Date|boolean){
  if(!expires) return false;
  let date = new Date();
  if(typeof expires === 'string') date = new Date(expires);
  if(typeof expires === 'number') date = new Date(expires);
  return 'Expires='+date.toUTCString()+';Max-Age='+Math.round(
      ( date.valueOf() - (new Date()).valueOf() ) / 1000
  );
}

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
  stringify: function( obj: CookieObject ){
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
  parse: function( string, path, domain ){

      const s = string.replace(/;\s+/g,';').split(';')
          .map((s) => s.replace(/\s+\s+/g,'=').split('='));

      let n = s.shift();

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
      obj.name = n.shift();
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
  tokenize: function( array: CookieObject[] ){
      return array.map((s) => s.name+'='+s.value).join('; ');
  }
};

export default cookie
