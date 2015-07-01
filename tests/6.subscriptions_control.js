var should = require("should"),
    Channel = require("../channel");

describe("subscriptions control", function(){

    describe("unsubscribe", function(){

        var c = new Channel(),
            count = 0;

        var s1 = c.subscribe("test.hello.world", function(){
            count++;
        });

        var s2 = c.subscribe("test.*.world", function(){
            count++;
        });

        var s3 = c.subscribe("test.#", function(){
            count++;
        });

        it("should invoke all subscriptions before unsubscribe", function(){
            c.publish("test.hello.world");
            should.equal(count, 3);
        });

        it("should invoke some subscriptions after unsubscribe", function(){
            s1.unsubscribe();
            s3.unsubscribe();
            count = 0;
            c.publish("test.hello.world");
            should.equal(count, 1);
        });

    });

});
