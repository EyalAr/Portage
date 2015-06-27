var should = require("should"),
    Channel = require("../channel");

describe("Channels", function(){

    describe("single subscription", function(){

        describe("single publication", function(){

            describe("specific topic with one section", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topic = "test",
                        data = "foo";

                    c.subscribe(topic, function(spy){
                        should.equal(data, spy);
                        done();
                    });

                    c.publish(topic, data);
                });

            });

            describe("specific topic with multiple sections", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topic = "test.hello",
                        data = "foo";

                    c.subscribe(topic, function(spy){
                        should.equal(data, spy);
                        done();
                    });

                    c.publish(topic, data);
                });

            });

            describe("pattern with non greedy wildcard (partial)", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topic = "test.hello",
                        pattern = "test.*",
                        data = "foo";

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        done();
                    });

                    c.publish(topic, data);
                });

            });

            describe("pattern with non greedy wildcard (full)", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topicOk = "test",
                        topicNotOk = "test.hello",
                        pattern = "*",
                        dataOk = "foo",
                        dataNotOk = "bar";

                    c.subscribe(pattern, function(spy){
                        should.equal(dataOk, spy);
                        done();
                    });

                    c.publish(topicNotOk, dataNotOk);
                    c.publish(topicOk, dataOk);
                });

            });

            describe("pattern with greedy wildcard (partial)", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topic = "test.hello.world",
                        pattern = "test.**",
                        data = "foo";

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        done();
                    });

                    c.publish(topic, data);
                });

            });

            describe("pattern with greedy wildcard (full)", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topic = "test.hello.world",
                        pattern = "**",
                        data = "foo";

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        done();
                    });

                    c.publish(topic, data);
                });

            });

            describe("pattern with mixed wildcards", function(){

                var c = new Channel();

                it("should invoke callback once with correct data", function(done){
                    var topic = "test.hello.world.nice.to.meet.you",
                        patternOk = "test.*.world.*.to.**",
                        patternNotOk = "test.*.world.to.**",
                        data = "foo";

                    c.subscribe(patternOk, function(spy){
                        should.equal(data, spy);
                        done();
                    });

                    c.subscribe(patternNotOk, function(spy){
                        throw Error("Should not be called");
                    });

                    c.publish(topic, data);
                });

            });

        });

        describe("multiple publications", function(){

            describe("specific topic", function(){

                var c = new Channel();

                it("should invoke callback twice with correct data", function(done){
                    var topic = "test.hello",
                        data = "foo",
                        called = false;

                    c.subscribe(topic, function(spy){
                        should.equal(data, spy);
                        if (called) done();
                        else called = true;
                    });

                    c.publish(topic, data);
                    c.publish(topic, data);
                });

            });

            describe("pattern with non greedy wildcard (partial)", function(){

                var c = new Channel();

                it("should invoke callback twice with correct data", function(done){
                    var topic1 = "test.hello",
                        topic2 = "test.world",
                        pattern = "test.*",
                        data = "foo",
                        called = false;

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        if (called) done();
                        else called = true;
                    });

                    c.publish(topic1, data);
                    c.publish(topic2, data);
                });

            });

            describe("pattern with non greedy wildcard (full)", function(){

                var c = new Channel();

                it("should invoke callback twice with correct data", function(done){
                    var topic1 = "hello",
                        topic2 = "world",
                        pattern = "*",
                        data = "foo",
                        called = false;

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        if (called) done();
                        else called = true;
                    });

                    c.publish(topic1, data);
                    c.publish(topic2, data);
                });

            });

            describe("pattern with greedy wildcard (partial)", function(){

                var c = new Channel();

                it("should invoke callback twice with correct data", function(done){
                    var topic1 = "test.hello.world",
                        topic2 = "test.world.hello",
                        pattern = "test.**",
                        data = "foo",
                        called = false;

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        if (called) done();
                        else called = true;
                    });

                    c.publish(topic1, data);
                    c.publish(topic2, data);
                });

            });

            describe("pattern with greedy wildcard (full)", function(){

                var c = new Channel();

                it("should invoke callback twice with correct data", function(done){
                    var topic1 = "test.hello.world",
                        topic2 = "test.world.hello",
                        pattern = "**",
                        data = "foo",
                        called = false;

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        if (called) done();
                        else called = true;
                    });

                    c.publish(topic1, data);
                    c.publish(topic2, data);
                });

            });

            describe("pattern with mixed wildcards", function(){

                var c = new Channel();

                it("should invoke callback twice with correct data", function(done){
                    var topic1 = "test.hello.world.nice.to.meet.you",
                        topic2 = "test.hello.world.nice.to.see.you",
                        pattern = "test.*.world.*.to.**",
                        data = "foo",
                        called = false;

                    c.subscribe(pattern, function(spy){
                        should.equal(data, spy);
                        if (called) done();
                        else called = true;
                    });

                    c.publish(topic1, data);
                    c.publish(topic2, data);
                });

            });

        });

    });

    describe("multiple subscriptions", function(){

        describe("single publication", function(){

            var c = new Channel();

            it("should invoke each callback once with correct data", function(done){
                var topic = "test.hello.world.nice.to.meet.you",
                    pattern1 = "*.hello.**",
                    pattern2 = "test.*.world.nice.to.**",
                    data = "foo",
                    s1Called = false,
                    s2Called = false;

                c.subscribe(pattern1, function(spy){
                    should.equal(data, spy);
                    s1Called = true;
                    if (s2Called) done();
                });

                c.subscribe(pattern2, function(spy){
                    should.equal(data, spy);
                    s2Called = true;
                    if (s1Called) done();
                });

                c.publish(topic, data);
            });

        });

        describe("multiple publications", function(){

            var c = new Channel();

            it("should invoke each callback twice with correct data", function(done){
                var topic1 = "test.hello.world.nice.to.meet.you",
                    topic2 = "test.hello.world.nice.to.see.you",
                    pattern1 = "*.hello.**",
                    pattern2 = "test.*.world.nice.to.**",
                    data = "foo",
                    s1Called = 0,
                    s2Called = 0;

                c.subscribe(pattern1, function(spy){
                    should.equal(data, spy);
                    s1Called++;
                    if (s1Called === 2 && s2Called === 2) done();
                });

                c.subscribe(pattern2, function(spy){
                    should.equal(data, spy);
                    s2Called++;
                    if (s1Called === 2 && s2Called === 2) done();
                });

                c.publish(topic1, data);
                c.publish(topic2, data);
            });

        });

    });

});
