import should from "should";
import Channel from "../src/Channel";

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

    describe("limit", function(){

        describe("non zero", function(){

            describe("before first publication", function(){

                var c = new Channel(),
                    count = 0;

                c.subscribe("test.hello.world", function(){
                    count++;
                }).limit(3);

                it("should invoke subscription 3 times", function(){
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    should.equal(count, 3);
                });

            });

            describe("after first publication", function(){

                var c = new Channel(),
                    count = 0;

                var s = c.subscribe("test.hello.world", function(){
                    count++;
                });

                it("should invoke subscription 4 times", function(){
                    c.publish("test.hello.world");

                    s.limit(3);

                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");

                    should.equal(count, 4);
                });

            });

        });

        describe("zero", function(){

            describe("before first publication", function(){

                var c = new Channel(),
                    count = 0;

                c.subscribe("test.hello.world", function(){
                    count++;
                }).limit(0);

                it("should invoke subscription 0 times", function(){
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    should.equal(count, 0);
                });

            });

            describe("after first publication", function(){

                var c = new Channel(),
                    count = 0;

                var s = c.subscribe("test.hello.world", function(){
                    count++;
                });

                it("should invoke subscription 1 time", function(){
                    c.publish("test.hello.world");

                    s.limit(0);

                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");
                    c.publish("test.hello.world");

                    should.equal(count, 1);
                });

            });

        });

    });

    describe("once", function(){

        var c = new Channel(),
            count = 0;

        c.subscribe("test.hello.world", function(){
            count++;
        }).once();

        it("should invoke subscription 1 time", function(){
            c.publish("test.hello.world");
            c.publish("test.hello.world");
            c.publish("test.hello.world");
            c.publish("test.hello.world");
            c.publish("test.hello.world");
            should.equal(count, 1);
        });

    });

});
