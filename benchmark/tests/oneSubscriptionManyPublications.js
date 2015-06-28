var Test = require("../test");

module.exports = new Test(

    "One specific subscription, many publications",

    function (N, hub, done){
        var start = Date.now(),
            c = hub.channel("C" + Math.random()),
            n = 0;

        c.subscribe("topic.hello.world", function(){
            n++;
            if (n === N - 1) done(null, Date.now() - start);
        });

        for (var i = 0 ; i < N ; i++){
            c.publish("topic.hello.world");
            c.publish("no-match");
        }
    }

);
