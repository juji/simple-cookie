function printExpires(expires){
	if(!expires) return false;
	if(typeof expires == 'string') expires = new Date(expires);
	if(typeof expires == 'number') expires = new Date(expires);
	var n = ( expires.valueOf() - (new Date()).valueOf() ) / 1000;
	return 'Expires='+expires.toGMTString()+';Max-Age='+Math.round( n );
}

var cookie = {
	stringify: function( obj ){
		var value;
		try{
			value = encodeURIComponent(obj.value);
		}catch(e){
			value = obj.value;
		}
		return [ 
				
				obj.name+'='+value,
				( typeof obj.expires != 'undefined' && obj.expires ? printExpires(obj.expires) : '' ),
				( typeof obj.path != 'undefined' ? (obj.path ? 'Path='+obj.path : '') : 'Path=/' ),
				( typeof obj.domain != 'undefined' && obj.domain ? 'Domain='+obj.domain : '' ),
				( typeof obj.secure != 'undefined' && obj.secure ? 'secure' : '' ),
				( typeof obj.httponly != 'undefined' && obj.httponly ? 'HttpOnly' : '' )

			   ].join(';').replace(/;+/g,';').replace(/;$/,'').replace(/;/g,'; ');
	},
	parse: function( string, path, domain ){
		var s = string.replace(/;\s+/g,';').split(';')
		.map(function(s){return s.replace(/\s+\=\s+/g,'=').split('=');});
		
		var n = s.shift();

		var obj = {};
		obj.expires = false;
		obj.httponly = false;
		obj.secure = false;
		obj.path = path || '/';
		obj.domain = domain || '';

		var I, f = {
				'httponly': function(){ obj.httponly = true; },
				'secure': function(){ obj.secure = true; },
				'expires': function(v){ obj.expires = new Date(v); },
				'max-age': function(v){ if(obj.expires) return; obj.expires = new Date((new Date()).valueOf()+(v*1000)); },
				'path': function(v){ obj.path = v; },
				'domain': function(v){ obj.domain = v; }
			};

		for(var i in s) {
			I = s[i][0].toLowerCase();
			if( typeof f[I] != 'undefined' ) f[I]( s[i].length==2 ? s[i][1] : '' );
		}

		if( !obj.expires ) obj.expires = 0;
		obj.name = n[0];
		try{
			obj.value = decodeURIComponent(n[1]);
		}catch(e){
			obj.value = n[1];
		}
		return obj;
	},
	tokenize: function( array ){
		return array.map(function(s){ return s.name+'='+encodeURIComponent(s.value); }).join('; ');
	}
};

module.exports = exports = cookie;