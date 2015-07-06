import should from "should";
import portage from "../src/portage";

describe("publications meta data", function(){

    describe("topic", function(){

        var c = new portage.Channel(),
            topicSpy;

        c.subscribe("test.*.world", function(data, meta){
            topicSpy = meta.topic;
        });

        it("should invoke subscription with the correct topic", function(){
            c.publish("test.hello.world");
            should.equal(topicSpy, "test.hello.world");
        });

    });

    describe("called", function(){

        var c = new portage.Channel(),
            calledSpy;

        c.subscribe("test.*.world", function(data, meta){
            calledSpy = meta.called;
        });

        it("should have been called 0 times before", function(){
            c.publish("test.hello.world");
            should.equal(calledSpy, 0);
        });

        it("should have been called 1 times before", function(){
            c.publish("test.hello.world");
            should.equal(calledSpy, 1);
        });

    });

    describe("limit", function(){

        var c = new portage.Channel(),
            limitSpy;

        var s = c.subscribe("test.*.world", function(data, meta){
            limitSpy = meta.limit;
        });
        s.limit(1);

        it("should have the correct limit", function(){
            c.publish("test.hello.world");
            should.equal(limitSpy, 1);
        });

    });

    describe("last", function(){

        var c = new portage.Channel(),
            lastSpy;

        var s = c.subscribe("test.*.world", function(data, meta){
            lastSpy = meta.last;
        });
        s.limit(2);

        it("should not be last", function(){
            c.publish("test.hello.world");
            should.equal(lastSpy, false);
        });

        it("should be last", function(){
            c.publish("test.hello.world");
            should.equal(lastSpy, true);
        });

    });

    describe("data and meta arguments", function(){

        var c = new portage.Channel(),
            metaSpy, dataSpy;

        c.subscribe("test.*.world", function(data, meta){
            dataSpy = data;
            metaSpy = meta;
        });

        it("data should be correct", function(){
            c.publish("test.hello.world", ["foo", "bar"]);
            dataSpy.should.have.length(2);
            dataSpy.should.containEql("foo");
            dataSpy.should.containEql("bar");
            metaSpy.should.be.type("object");
        });

        it("data should be undefined", function(){
            c.publish("test.hello.world");
            should(dataSpy).be.type("undefined");
            metaSpy.should.be.type("object");
        });

    });

});
