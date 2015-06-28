var Test = require("../test");

module.exports = new Test(

    "One pattern subscriptions, many publications",

    function (N, hub, done){
        var start = Date.now(),
            c = hub.channel("C" + Math.random()),
            n = 0,
            i;

        c.subscribe("topic.*.world.*", function(){
            n++;
            if (n === N - 1) done(null, Date.now() - start);
        });

        for (i = 0 ; i < N ; i++){
            c.publish("topic.hello.world." + i);
            c.publish("no-match" + i);
        }
    }

);
