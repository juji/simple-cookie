
import { expect } from "chai";
import { simpleCookie } from '../src'

let c = {
    name : 'cookiename',
    value: 'cookie value with space',
    expires: (new Date()).valueOf() + 500000
};

let co: string;
let date = (new Date((new Date()).valueOf() + 3000)).toUTCString();

describe('simple-cookie',function(){

    describe('#stringify',function(){

        it('should return cookie string from object',function(){

            co = simpleCookie.stringify(c);
            expect(co).to.be.a( 'string' );
            expect((new RegExp('^'+c.name)).test(co)).to.equal(true);
        });

    });

    describe('#parse',function(){

        it('should return object from cookie string',function(){

            const h = simpleCookie.parse(co,undefined,'juji.com');
            expect(h.name).to.be.equal( c.name );
            expect(h.expires).to.be.a( 'date' );
            expect(h.path).to.equal( '/' );
            expect(h.domain).to.equal( 'juji.com' );

        });

    });

    describe('#parseString',function(){
        it('should return the right object from cookie string',function(){

            const theCookie = 'cnameSecure=cval1sec; expires='+date+
							'; domain=.example.com; path=/; secure; samesite=None';

            const h = simpleCookie.parse( theCookie, 'example.com', '/is/cool' );
            expect(h.name).to.equal( 'cnameSecure' );
            expect(h.value).to.equal( 'cval1sec' );
            expect(h.expires).to.be.a( 'date' );
            expect((h.expires as Date).toUTCString()).to.equal( date );
            expect(h.secure).to.equal( true );
            expect(h.httponly).to.equal( false );
            expect(h.path).to.equal( '/' );
            expect(h.domain).to.equal( '.example.com' );
            expect(h.samesite).to.equal( 'None' );

        });		
    });

    describe('#parseString2',function(){
        it('should return the right object from cookie string',function(){

            const theCookie = 'cnameSecure=cval1sec=9; expires='+date+
                            '; domain=.example.com; path=/; secure; samesite=None';

            const h = simpleCookie.parse( theCookie, 'example.com', '/is/cool' );
            expect(h.name).to.equal( 'cnameSecure' );
            expect(h.value).to.equal( 'cval1sec=9' );
            expect(h.expires).to.be.a( 'date' );
            expect((h.expires as Date).toUTCString()).to.equal( date );
            expect(h.secure).to.equal( true );
            expect(h.httponly).to.equal( false );
            expect(h.path).to.equal( '/' );
            expect(h.domain).to.equal( '.example.com' );
            expect(h.samesite).to.equal( 'None' );

        });     
    });

    describe('#tokeninze',function(){
        it('should return tokenized cookies ready to send', function(){
            const cc = [
                {name:'cookiename1',value:'cookie name 1'},
                {name:'cookiename2',value:'cookie name 2'},
                {name:'cookiename3',value:'cookie name 3'},
                {name:'cookiename4',value:'cookie name 4'},
                {name:'cookiename5',value:'cookie name 5'}
            ];

            const h = simpleCookie.tokenize(cc);
            expect(h).to.be.a('string');


        });
    });

});
