var portage = require("../../"),
    c = portage.channel("my-channel");

// subscribe to time.* messages

c.subscribe("time.*", function(time){
    console.log(time);
});
