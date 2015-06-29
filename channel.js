(function(){
"use strict";

var _ = require('lodash'),
    Subscription = require('./subscription');

function Channel(){
    this._separator = '.';
    this._wildcard = '*';
    this._greedyWildcard = '#';
    this._topicsDefs = {};
}

Channel.prototype.subscribe = function(topic, cb){
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

    var s = new Subscription(cb, topicDef.direct);
    topicDef.direct.push(s);
    return s;
};

Channel.prototype.publish = function(topic){
    if (_.isString(topic)) topic = topic.split(this._separator);
    if (!_.isArray(topic)) throw Error("topic must be an array or a string");
    if (!topic.length) throw Error("topic must contain at least one section");
    if (!topic.every(_.isString)) throw Error("all topic sections must be strings");
    if (topic.some(isWildcard.bind(this)) || topic.some(isGreedyWildcard.bind(this)))
        throw Error("topic section cannot be a wildcard");

    var subs = gatherSubscriptions(
            topic,
            {
                direct: [],
                subtopics: this._topicsDefs
            },
            this._wildcard,
            this._greedyWildcard
        ),
        data = Array.prototype.slice.call(arguments, 1);

    subs.forEach(invoke);

    function invoke(s){
        s.invoke(data);
    }
};

function isWildcard(s){
    return s === this._wildcard;
}

function isGreedyWildcard(s){
    return s === this._greedyWildcard;
}

function gatherSubscriptions(topic, topicsDefs, wildcard, greedyWildcard){
    var subtopic,
        classifier = topic[0],
        rest = topic.slice(1),
        subs = [];

    if (!rest.length){
        for (subtopic in topicsDefs.subtopics){
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
                if (
                    subtopic === classifier ||
                    subtopic === wildcard ||
                    subtopic === greedyWildcard
                ){
                    _push(subs, topicsDefs.subtopics[subtopic].direct);
                }
            }
        }
    } else {
        for (subtopic in topicsDefs.subtopics){
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
                if (subtopic === greedyWildcard){
                    _push(
                        subs,
                        gatherDeepSubscriptions(
                            topicsDefs.subtopics[subtopic]
                        )
                    );
                } else if (subtopic === classifier || subtopic === wildcard){
                    _push(
                        subs,
                        gatherSubscriptions(
                            rest,
                            topicsDefs.subtopics[subtopic],
                            wildcard,
                            greedyWildcard
                        )
                    );
                }
            }
        }
    }

    return subs;
}

function gatherDeepSubscriptions(topicsDefs){
    var subtopic, subs = [];

    _push(subs, topicsDefs.direct);

    for (subtopic in topicsDefs.subtopics){
        if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
            _push(subs, gatherDeepSubscriptions(topicsDefs[subtopic]));
        }
    }

    return subs;
}

function _push(target, elements){
    var i;
    for (i = 0 ; i < elements.length ; i++) target.push(elements[i]);
}

module.exports = Channel;
})();