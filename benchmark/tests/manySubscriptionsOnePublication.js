var Test = require("../test");

module.exports = new Test(

    "Many specific subscriptions, 1 publication",

    function (N, hub, done){
        var start = Date.now(),
            c = hub.channel("C" + Math.random()),
            n = 0;

        for (var i = 0 ; i < N ; i++){
            c.subscribe("topic.hello.world", function(){
                n++;
                if (n === N - 1) done(null, Date.now() - start);
            });
            c.subscribe("topic.hello.world.no-match", function(){});
        }

        c.publish("topic.hello.world");
    }

);
