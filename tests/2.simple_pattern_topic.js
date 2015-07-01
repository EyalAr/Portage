var should = require("should"),
    Channel = require("../channel");

describe("simple pattern topics", function(){

    describe("single subscription", function(){

        describe("single publication", function(){

            describe("pattern with non greedy wildcard (partial)", function(){

                var c = new Channel(),
                    topic = "test.hello",
                    pattern = "test.*",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback once with correct data", function(){
                    c.publish(topic, data);
                    should.equal(data, spy);
                    should.equal(called, 1);
                });

            });

            describe("pattern with non greedy wildcard (full)", function(){

                var c = new Channel(),
                    topicOk = "test",
                    topicNotOk = "test.hello",
                    pattern = "*",
                    dataOk = "foo",
                    dataNotOk = "bar",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback once with correct data", function(){
                    c.publish(topicNotOk, dataNotOk);
                    c.publish(topicOk, dataOk);
                    should.equal(dataOk, spy);
                    should.equal(called, 1);
                });

            });
        });

        describe("multiple publications", function(){

            describe("pattern with non greedy wildcard (partial)", function(){

                var c = new Channel(),
                    topic1 = "test.hello",
                    topic2 = "test.world",
                    pattern = "test.*",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback twice with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);

                    should.equal(data, spy);
                    should.equal(called, 2);
                });

            });

            describe("pattern with non greedy wildcard (full)", function(){

                var c = new Channel(),
                    topic1 = "hello",
                    topic2 = "world",
                    pattern = "*",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback twice with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);

                    should.equal(data, spy);
                    should.equal(called, 2);
                });

            });

        });

    });

});
