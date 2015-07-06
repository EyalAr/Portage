var portage = require("../../"),
    c = portage.channel("my-channel");

// publish the time in different formats every 2 seconds
setInterval(function(){
    c.publish("time.epoch", Date.now());
    c.publish("time.local", (new Date()).toString());
    c.publish("time.utc", (new Date()).toISOString());
}, 2000);
