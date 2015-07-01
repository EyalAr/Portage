import should from "should";
import Channel from "../src/Channel";

describe("multiple subscriptions", function(){

    describe("single publication", function(){

        var c = new Channel(),
            topic = "test.hello.world.nice.to.meet.you",
            pattern1 = "*.hello.#",
            pattern2 = "test.*.world.nice.to.#",
            data = "foo",
            spy1,
            spy2,
            s1Called = 0,
            s2Called = 0;

        c.subscribe(pattern1, function(spy){
            spy1 = spy;
            s1Called++;
        });

        c.subscribe(pattern2, function(spy){
            spy2 = spy;
            s2Called++;
        });

        it("should invoke each callback once with correct data", function(){
            c.publish(topic, data);

            should.equal(data, spy1);
            should.equal(data, spy2);
            should.equal(s1Called, 1);
            should.equal(s2Called, 1);
        });

    });

    describe("multiple publications", function(){

        var c = new Channel(),
            topic1 = "test.hello.world.nice.to.meet.you",
            topic2 = "test.hello.world.nice.to.see.you",
            pattern1 = "*.hello.#",
            pattern2 = "test.*.world.nice.to.#",
            data = "foo",
            spy1,
            spy2,
            s1Called = 0,
            s2Called = 0;

        c.subscribe(pattern1, function(spy){
            spy1 = spy;
            s1Called++;
        });

        c.subscribe(pattern2, function(spy){
            spy2 = spy;
            s2Called++;
        });

        it("should invoke each callback twice with correct data", function(){
            c.publish(topic1, data);
            c.publish(topic2, data);

            should.equal(data, spy1);
            should.equal(data, spy2);
            should.equal(s1Called, 2);
            should.equal(s2Called, 2);
        });

    });

});
