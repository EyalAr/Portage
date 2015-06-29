var should = require("should"),
    Channel = require("../channel");

describe("Channels", function(){

    describe("single subscription", function(){

        describe("single publication", function(){

            describe("specific topic with one section", function(){

                var c = new Channel(),
                    topic = "test",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(topic, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback once with correct data", function(){
                    c.publish(topic, data);

                    should.equal(data, spy);
                    should.equal(called, 1);
                });

            });

            describe("specific topic with multiple sections", function(){

                var c = new Channel(),
                    topic = "test.hello",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(topic, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback once with correct data", function(){
                    c.publish(topic, data);
                    should.equal(data, spy);
                    should.equal(called, 1);
                });

            });

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

            describe("pattern with greedy wildcard (partial)", function(){

                var c = new Channel(),
                    topic = "test.hello.world",
                    pattern = "test.#",
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

            describe("pattern with greedy wildcard (full)", function(){

                var c = new Channel(),
                    topic = "test.hello.world",
                    pattern = "#",
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

            describe("pattern with mixed wildcards", function(){

                var c = new Channel(),
                    topic = "test.hello.world.nice.to.meet.you",
                    patternOk = "test.*.world.*.to.#",
                    patternNotOk = "test.*.world.to.#",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(patternOk, cb);
                c.subscribe(patternNotOk, cb);

                function cb(_spy){
                    spy = _spy;
                    called++;
                }

                it("should invoke callback once with correct data", function(){
                    c.publish(topic, data);
                    should.equal(data, spy);
                    should.equal(called, 1);
                });

            });

        });

        describe("multiple publications", function(){

            describe("specific topic", function(){

                var c = new Channel(),
                    topic = "test.hello",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(topic, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback twice with correct data", function(){
                    c.publish(topic, data);
                    c.publish(topic, data);

                    should.equal(data, spy);
                    should.equal(called, 2);
                });

            });

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

            describe("pattern with greedy wildcard (partial)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world",
                    topic2 = "test.world.hello",
                    pattern = "test.#",
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

            describe("pattern with greedy wildcard (full)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world",
                    topic2 = "test.world.hello",
                    pattern = "#",
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

            describe("pattern with mixed wildcards", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world.nice.to.meet.you",
                    topic2 = "test.hello.world.nice.to.see.you",
                    pattern = "test.*.world.*.to.#",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                c.publish(topic1, data);
                c.publish(topic2, data);

                it("should invoke callback twice with correct data", function(){
                    should.equal(data, spy);
                    should.equal(called, 2);
                });

            });

        });

    });

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
