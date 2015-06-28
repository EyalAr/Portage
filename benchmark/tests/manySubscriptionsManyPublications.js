var Test = require("../test");

module.exports = new Test(

    "Many specific subscriptions, many publication",

    function (N, hub, done){
        var start = Date.now(),
            c = hub.channel("C" + Math.random()),
            n = 0,
            i;

        for (i = 0 ; i < N ; i++){
            c.subscribe("topic.hello.world." + i, function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.no-match", function(){});
        }

        for (i = 0 ; i < N ; i++){
            c.publish("topic.hello.world." + i);
            c.publish("no-match");
        }
    }

);
