
var should = require('chai').should();
var cookie = require('../');
var c = {
			name : 'cookiename',
			value: 'cookie value with space',
			expires: (new Date()).valueOf() + 500000
		};

var co;

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
			console.log(h);
			h.should.be.a('string');


		});
	});

});