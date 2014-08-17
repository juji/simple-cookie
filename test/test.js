
var should = require('chai').should();
var cookie = require('../');
var c = {
			name : 'cookiename',
			value: 'cookie value with space',
			expires: (new Date()).valueOf() + 500000
		};

var co;
var date = (new Date((new Date()).valueOf() + 3000)).toGMTString();

describe('simple-cookie',function(){

	describe('#stringify',function(){

		it("should return cookie string from object",function(){

			co = cookie.stringify(c);
			co.should.be.a.string;
			(new RegExp('^'+c.name)).test(co).should.be.ok;
		});

	});

	describe('#parse',function(){

		it("should return object from cookie string",function(){

			var h = cookie.parse(co,false,'juji.com');
			h.name.should.equal( c.name );
			h.expires.should.be.a( 'date' );
			h.path.should.equal( '/' );
			h.domain.should.equal( 'juji.com' );

		});

	});

	describe('#parseString',function(){
		it("should return the right object from cookie string",function(){

			var theCookie = 'cnameSecure=cval1sec; expires='+date+
							'; domain=.example.com; path=/; secure';

			var h = cookie.parse( theCookie, 'example.com', '/is/cool' );
			h.name.should.equal( 'cnameSecure' );
			h.value.should.equal( 'cval1sec' );
			h.expires.should.be.a( 'date' );
			h.expires.toGMTString().should.equal( date );
			h.secure.should.equal( true );
			h.httponly.should.equal( false );
			h.path.should.equal( '/' );
			h.domain.should.equal( '.example.com' );

		});		
	});

	describe('#tokeninze',function(){
		it('should return tokenized cookies ready to send', function(){
			var cc = [
				{name:'cookiename1',value:'cookie name 1'},
				{name:'cookiename2',value:'cookie name 2'},
				{name:'cookiename3',value:'cookie name 3'},
				{name:'cookiename4',value:'cookie name 4'},
				{name:'cookiename5',value:'cookie name 5'}
			];

			var h = cookie.tokenize(cc);
			h.should.be.a('string');


		});
	});

});