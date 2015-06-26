(function(){
"use strict";

var _ = require('lodash');

function Portage(){
    this._separator = '.';
    this._wildcard = '*';
    this._greedyWildcard = '**';
    this._topicsDefs = {};
}

Portage.prototype.subscribe = function(topic, cb){
    var greedyWildcard = this._greedyWildcard;
    if (_.isString(topic)) topic = topic.split(this._separator);
    if (!_.isArray(topic)) throw Error("topic must be an array or a string");
    if (!topic.length) throw Error("topic must contain at least one section");
    if (!topic.every(_.isString)) throw Error("all topic sections must be strings");
    if (topic.slice(0, -1).some(isGreedyWildcard.bind(this)))
        throw Error("greedy wildcard must be the last section");

    var topicDef, i,
        classifier = topic[0];

    this._topicsDefs[classifier] = this._topicsDefs[classifier] || {
        direct: [],
        subtopics: {}
    };

    topicDef = this._topicsDefs[classifier];

    for (i = 1 ; i < topic.length ; i++){
        topicDef =
        topicDef.subtopics[topic[i]] = topicDef.subtopics[topic[i]] || {
            direct: [],
            subtopics: {}
        };
    }

    topicDef.direct.push(cb);
};

Portage.prototype.publish = function(topic){
    var wildcard = this._wildcard;
    if (_.isString(topic)) topic = topic.split(this._separator);
    if (!_.isArray(topic)) throw Error("topic must be an array or a string");
    if (!topic.length) throw Error("topic must contain at least one section");
    if (!topic.every(_.isString)) throw Error("all topic sections must be strings");
    if (topic.some(isWildcard.bind(this)) || topic.some(isGreedyWildcard.bind(this)))
        throw Error("topic section cannot be a wildcard");

    var cbs = gatherCbs(
            topic,
            {
                direct: [],
                subtopics: this._topicsDefs
            },
            this._wildcard,
            this._greedyWildcard
        ),
        data = Array.prototype.slice.call(arguments, 1);

    cbs.forEach(invoke);

    function invoke(cb){
        cb.apply(null, data);
    }
};

function isWildcard(s){
    return s === this._wildcard;
}

function isGreedyWildcard(s){
    return s === this._greedyWildcard;
}

function gatherCbs(topic, topicsDefs, wildcard, greedyWildcard){
    var subtopic,
        classifier = topic[0],
        rest = topic.slice(1),
        cbs = [];

    if (!rest.length){
        for (subtopic in topicsDefs.subtopics){
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
                if (subtopic === classifier || subtopic === wildcard || subtopic === greedyWildcard){
                    cbs.push.apply(cbs, topicsDefs.subtopics[subtopic].direct);
                }
            }
        }
    } else {
        for (subtopic in topicsDefs.subtopics){
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
                if (subtopic === greedyWildcard){
                    cbs.push.apply(cbs, gatherDeepCbs(topicsDefs.subtopics[subtopic]));
                } else if (subtopic === classifier || subtopic === wildcard){
                    cbs.push.apply(cbs, gatherCbs(rest, topicsDefs.subtopics[subtopic], wildcard, greedyWildcard));
                }
            }
        }
    }

    return cbs;
}

function gatherDeepCbs(topicsDefs){
    var subtopic, cbs = [];

    cbs.push.apply(cbs, topicsDefs.direct);

    for (subtopic in topicsDefs.subtopics){
        if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
            cbs.push.apply(cbs, gatherDeepCbs(topicsDefs[subtopic]));
        }
    }

    return cbs;
}

module.exports = Portage;
})();
