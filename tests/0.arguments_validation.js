var should = require("should"),
    Channel = require("../channel");

describe("arguments validation", function(){

    describe("subscribe arguments", function(){

        var c = new Channel();

        it("should not throw an exception if pattern is string or array and callback is function", function(){
            c.subscribe.bind(c, "topic", function(){}).should.not.throw();
            c.subscribe.bind(c, ["topic", "hello"], function(){}).should.not.throw();
        });

        it("should throw an exception if callback is not function", function(){
            c.subscribe.bind(c, ["topic", "hello"], 123).should.throw();
        });

        it("should throw an exception if topic is not a string or an array", function(){
            c.subscribe.bind(c, 123, function(){}).should.throw();
            c.subscribe.bind(c, undefined, function(){}).should.throw();
            c.subscribe.bind(c, null, function(){}).should.throw();
            c.subscribe.bind(c, true, function(){}).should.throw();
            c.subscribe.bind(c, {}, function(){}).should.throw();
            c.subscribe.bind(c, function(){}, function(){}).should.throw();
            c.subscribe.bind(c, /topic/, function(){}).should.throw();
        });

    });

    describe("publish arguments", function(){

        var c = new Channel();

        it("should not throw an exception if topic is string or array", function(){
            c.publish.bind(c, "topic.hello").should.not.throw();
            c.publish.bind(c, ["topic", "hello"]).should.not.throw();
        });

        it("should throw an exception if topic is not a string or an array", function(){
            c.publish.bind(c, 123).should.throw();
            c.publish.bind(c, undefined).should.throw();
            c.publish.bind(c, null).should.throw();
            c.publish.bind(c, true).should.throw();
            c.publish.bind(c, {}).should.throw();
            c.publish.bind(c, function(){}).should.throw();
        });

        it("should throw an exception if topic contains wildcards", function(){
            c.publish.bind(c, "*.hello").should.throw();
            c.publish.bind(c, "hello.#").should.throw();
        });

    });

});
