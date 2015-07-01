var should = require("should"),
    Channel = require("../channel");

describe("greedy pattern topics", function(){

    describe("single subscription", function(){

        describe("single publication", function(){

            describe("pattern with greedy wildcard (at the end)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world",
                    topic2 = "test.hello.world.foo",
                    topic3 = "test.world",
                    topic4 = "mo-match", // should not match
                    pattern = "test.#",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback 3 times with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);
                    c.publish(topic3, data);
                    c.publish(topic4, data);
                    should.equal(data, spy);
                    should.equal(called, 3);
                });

            });

            describe("pattern with greedy wildcard (at the middle)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world.foo.foo.bar",
                    topic2 = "test.hello.world.foo.bar",
                    topic3 = "test.world.foo.bar",
                    topic4 = "test.world", // should not match
                    pattern = "test.#.foo.bar",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback 3 times with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);
                    c.publish(topic3, data);
                    c.publish(topic4, data);
                    should.equal(data, spy);
                    should.equal(called, 3);
                });

            });

            describe("pattern with greedy wildcard (at the start)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world.foo.foo.bar",
                    topic2 = "test.hello.world.foo.bar",
                    topic3 = "test.world.foo.bar",
                    topic4 = "world.test", // should not match
                    pattern = "#.foo.bar",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback 3 times with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);
                    c.publish(topic3, data);
                    c.publish(topic4, data);
                    should.equal(data, spy);
                    should.equal(called, 3);
                });

            });

            describe("pattern with greedy wildcard (multiple)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world.bar.foo.foo.boo.baz",
                    topic2 = "test.hello.world.bar.foo.boo.baz",
                    topic3 = "test.world.bar.foo.baz",
                    topic4 = "world.test.foo", // should not match
                    pattern = "test.#.bar.#.baz",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback 3 times with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);
                    c.publish(topic3, data);
                    c.publish(topic4, data);
                    should.equal(data, spy);
                    should.equal(called, 3);
                });

            });

            describe("pattern with greedy wildcard (multiple, consecutive)", function(){

                var c = new Channel(),
                    topic1 = "test.hello.world.bar.foo.foo.boo.baz.bar",
                    topic2 = "test.hello.world.bar.foo.boo.baz.bar",
                    topic3 = "test.world.bar.baz.bar",
                    topic4 = "world.test.foo", // should not match
                    pattern = "test.#.#.baz.bar",
                    data = "foo",
                    spy,
                    called = 0;

                c.subscribe(pattern, function(_spy){
                    spy = _spy;
                    called++;
                });

                it("should invoke callback 3 times with correct data", function(){
                    c.publish(topic1, data);
                    c.publish(topic2, data);
                    c.publish(topic3, data);
                    c.publish(topic4, data);
                    should.equal(data, spy);
                    should.equal(called, 3);
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

            describe("pattern with greedy wildcard (full, multiple)", function(){

                var c = new Channel(),
                    topic = "test.hello.world",
                    pattern = "#.#",
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

        });

        describe("multiple publications", function(){

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

        });

    });

});
