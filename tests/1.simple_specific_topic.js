var should = require("should"),
    Channel = require("../channel");

describe("simple specific topics", function(){

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

        });

    });

});
