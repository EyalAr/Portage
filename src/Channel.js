/* jshint esnext:true */

import _ from 'lodash';
import Subscription from './Subscription';

class Channel{
    constructor(){
        this._separator = '.';
        this._wildcard = '*';
        this._greedyWildcard = '#';
        this._topicsDefs = {};
    }

    subscribe(topic, cb){
        if (_.isString(topic)) topic = topic.split(this._separator);
        if (!_.isArray(topic)) throw Error("topic must be an array or a string");
        if (!_.isFunction(cb)) throw Error("callback must be a function");
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

        var s = new Subscription(cb, topicDef.direct);
        topicDef.direct.push(s);
        return s;
    }

    publish(topic, ...data){
        if (_.isString(topic)) topic = topic.split(this._separator);
        if (!_.isArray(topic)) throw Error("topic must be an array or a string");
        if (!topic.length) throw Error("topic must contain at least one section");
        if (!topic.every(_.isString)) throw Error("all topic sections must be strings");
        if (topic.some(isAnyWildcard.bind(this)))
            throw Error("topic section cannot be a wildcard");

        var subs = gatherSubscriptions.call(
                this,
                topic,
                {
                    direct: [],
                    subtopics: this._topicsDefs
                }
            );

        subs.forEach(s => s.invoke(data));
    }
}

function isWildcard(s){
    return s === this._wildcard;
}

function isGreedyWildcard(s){
    return s === this._greedyWildcard;
}

function isAnyWildcard(s){
    return isWildcard.call(this, s) || isGreedyWildcard.call(this, s);
}

function gatherSubscriptions(topic, topicsDefs){
    var subtopic,
        classifier = topic[0],
        rest = topic.slice(1),
        subs = [],
        wildcard = this._wildcard,
        greedyWildcard = this._greedyWildcard;

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
                        gatherDeepSubscriptions.call(
                            this,
                            rest,
                            topicsDefs.subtopics[subtopic]
                        )
                    );
                } else if (subtopic === classifier || subtopic === wildcard){
                    _push(
                        subs,
                        gatherSubscriptions.call(
                            this,
                            rest,
                            topicsDefs.subtopics[subtopic]
                        )
                    );
                }
            }
        }
    }

    return subs;
}

function gatherDeepSubscriptions(rest, topicsDefs){
    var subtopic,
        subs = [],
        wildcard = this._wildcard,
        greedyWildcard = this._greedyWildcard;

    _push(subs, topicsDefs.direct);

    for (subtopic in topicsDefs.subtopics){
        if (topicsDefs.subtopics.hasOwnProperty(subtopic)){
            var i = subtopic === greedyWildcard ? 0 : _.lastIndexOf(rest, subtopic);
            if (i !== -1){
                var def = {
                    direct: [],
                    subtopics: {}
                };
                def.subtopics[subtopic] = topicsDefs.subtopics[subtopic];
                _push(
                    subs,
                    gatherSubscriptions.call(
                        this,
                        rest.slice(i),
                        def
                    )
                );
            }
        }
    }

    return subs;
}

function _push(target, elements){
    var i;
    for (i = 0 ; i < elements.length ; i++) target.push(elements[i]);
}

export default Channel;
