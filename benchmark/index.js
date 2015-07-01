var async = require("async"),
    portage = require("../src/portage"),
    postal = require("postal");

var N = 1e3;

console.log("Portage vs Postal benchmark");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
console.log("N=" + N, "\n");

var testPairs = require("fs").readdirSync(__dirname + "/tests").map(function(path){
    var test = require(__dirname + "/tests/" + path);
    return pairRunnerSetup(
        test.title,
        test.run.bind(null, N, postal),
        test.run.bind(null, N, portage)
    );
});

async.series(testPairs, function(err, results){
    if (err)
        return console.log("Stopped tests due to an error:", err.toString());

    var portageWins = results.reduce(function(p, e, i, o){
            return p + (e === "portage" ? 1 : 0);
        }, 0),
        postalWins = results.length - portageWins;

    console.log("Portage is faster at", portageWins + "/" + results.length, "tests");
    console.log("Postal is faster at", postalWins + "/" + results.length, "tests");
});

function pairRunnerSetup(title, postalRunner, portageRunner){
    return function(done){
        console.log(title + "...");
        async.series([
            postalRunner,
            portageRunner
        ], function(err, results){
            if (err) return done(err);
            var tPostal = results[0],
                tPortage = results[1],
                tDiff = Math.abs(tPostal - tPortage),
                tRatio = tDiff / (tPostal > tPortage ? tPostal : tPortage);
            tRatio = (tRatio * 100).toFixed(2) + "%";
            console.log("Postal:\t\t", tPostal, "ms");
            console.log("Portage:\t", tPortage, "ms");
            console.log(
                tPostal < tPortage ? "Postal" : "Portage",
                "is",
                tDiff, "ms faster (" + tRatio + ")"
            );
            console.log();
            done(null, tPostal < tPortage ? "postal" : "portage");
        });
    };
}
