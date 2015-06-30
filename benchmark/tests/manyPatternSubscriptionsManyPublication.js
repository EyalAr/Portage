var Test = require("../test");

module.exports = new Test(

    "Many pattern subscriptions, many publications",

    function (N, hub, done){
        var start = Date.now(),
            c = hub.channel("C" + Math.random()),
            n = 0,
            i;

        for (i = 0 ; i < N ; i++){
            var s1 = Math.random() < 0.5 ? "topic.#" : "*.hello",
                s2 = Math.random() < 0.5 ? "world.*" : "#.foo",
                pattern = s1 + "." + s2 + "." + i;
            c.subscribe(pattern, function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.*.world.*.no-match", function(){});
        }

        for (i = 0 ; i < N ; i++){
            c.publish("topic.hello.world.foo." + i);
            c.publish("no-match");
        }
    }

);
