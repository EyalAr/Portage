import should from "should";
import portage from "../src/portage";

describe("arguments validation", function(){

    describe("Channel", function(){

        describe("subscribe", function(){

            var c = new portage.Channel();

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

        describe("publish", function(){

            var c = new portage.Channel();

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

    describe("Subscription", function(){

        describe("limit", function(){

            var c = new portage.Channel(),
                s = c.subscribe("topic", function(){});

            it("should not throw an exception if limit >= 0", function(){
                s.limit.bind(s, 0).should.not.throw();
                s.limit.bind(s, 3).should.not.throw();
                s.limit.bind(s, 10e9).should.not.throw();
            });

            it("should throw an exception if limit < 0", function(){
                s.limit.bind(s, -10).should.throw();
                s.limit.bind(s, -10e9).should.throw();
            });

            it("should throw an exception if limit is NaN", function(){
                s.limit.bind(s, NaN).should.throw();
            });

            it("should throw an exception if limit is not a number", function(){
                s.limit.bind(s, "hi").should.throw();
                s.limit.bind(s, "55").should.throw();
                s.limit.bind(s, false).should.throw();
                s.limit.bind(s, true).should.throw();
                s.limit.bind(s, {}).should.throw();
                s.limit.bind(s, undefined).should.throw();
                s.limit.bind(s, function(){}).should.throw();
                s.limit.bind(s, /111/).should.throw();
            });

        });

    });

});
