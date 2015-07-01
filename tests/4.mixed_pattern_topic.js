var should = require("should"),
    Channel = require("../channel");

describe("mixed pattern topics", function(){

    describe("single subscription", function(){

        describe("single publication", function(){

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

});
