var Test = require("../test");

module.exports = new Test(

    "Many pattern subscriptions, 1 publication",

    function (N, hub, done){
        var start = Date.now(),
            c = hub.channel("C" + Math.random()),
            n = 0;

        for (var i = 0 ; i < N / 10 ; i++){
            c.subscribe("#", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.#", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.#", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.#", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.foo.#", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("*.hello.world.foo.bar", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.*.world.foo.bar", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.*.foo.bar", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.*.bar", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.foo.*", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.foo.no-match", function(){});
        }

        c.publish("topic.hello.world.foo.bar");
    }

);
