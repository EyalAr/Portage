(function(){
"use strict";

var _ = require('lodash');

function Portage(){
    this._separator = '.';
    this._wildcard = '*';
    this._topicsDefs = {};
}

Portage.prototype.subscribe = function(topic, cb){
    if (_.isString(topic)) topic = topic.split(this._separator);
    if (!_.isArray(topic)) throw Error("topic must be an array or a string");
    if (!topic.length) throw Error("topic must contain at least one section");
    if (!topic.every(_.isString)) throw Error("all topic sections must be strings");

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
    if (topic.some(isWildcard)) throw Error("topic section cannot be a wildcard");

    var cbs = gatherCbs(topic, { subtopics: this._topicsDefs }, this._wildcard),
        data = Array.prototype.slice.call(arguments, 1);

    cbs.forEach(invoke);

    function invoke(cb){
        cb.apply(null, data);
    }

    function isWildcard(s){
        return s === wildcard;
    }
};

function gatherCbs(topic, topicsDefs, wildcard){
    var subtopic,
        classifier = topic[0],
        rest = topic.slice(1),
        cbs = [];

    if (!rest.length){
        for (subtopic in topicsDefs.subtopics){
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
                if (subtopic === classifier || subtopic === wildcard){
                    cbs.push.apply(cbs, topicsDefs.subtopics[subtopic].direct);
                }
            }
        }
    } else {
        for (subtopic in topicsDefs.subtopics){
            if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
                if (subtopic === classifier || subtopic === wildcard){
                    cbs.push.apply(cbs, gatherCbs(rest, topicsDefs.subtopics[subtopic], wildcard));
                }
            }
        }
    }

    return cbs;
}

module.exports = Portage;
})();
