# Portage

JS pub/sub

## Intro

Channels are used to publish messages on certain topics, and to subscribe
to messages on certain topics.

Topics are organized in a hierarchical manner. For example, `chat.new-message`
is a sub-topic of `chat`. This mostly affects the way the library efficiently
filters subscription handlers when a message is published, but also relates
to the usage of wild cards in subscriptions (see below).

Hubs are simply an aggregation of channels, which can easily be accessed (and
created on the fly) by a key.

## Hub API

```
var Hub = require('portage/hub');
var myHub = new Hub();
```

### Get / create a channel

`var myChannel = myHub.channel(name)`

- `name {String}`: The channel name.

If channel `name` is requested for the first time, it is first created and then
returned. Otherwise the existing channel with that name is returned.

### Default global hub

`var portage = require('portage')`

`portage` is a `Hub` object which is created when the library is loaded.
`require('portage')` always returns the same default hub.

## Channel API

`var Channel = require('portage/channel')`

### Create a channel

`var myChannel = new Channel()`

### Publish data on a topic

`myChannel.publish(topic, arg1, arg2, ...)`

- `topic {String}`: The topic of the publication. See topic structure below.
- `arg1, arg2, ...`: Arbitrary arguments of the publication.

### Subscribe to a topic

`var s = myChannel.subscribe(pattern, callback)`

- `pattern {String}`: The pattern of topics of which publications to subscribe.
   See topic structure below.
- `callback {Function}`: Callback function to invoke when a message is published
   whose topic matches the pattern. The function is called with the published
   arguments.

**Return value** is an object with an `unsubscribe` method: `s.unsubscribe()`.

### Topics structure

Topics are strings which are divided into sections by the `'.'` separator.
For example, the topic `'chat.new-message.server'` has 3 sections: `'chat'`,
`'new-message'` and `'server'`.

On subscriptions, a topic pattern may be specified. A pattern can include wild
cards of 2 types:

- `'*'`: Non greedy wild card. Will match any one section. For example,
  `'chat.*.server'` will match both `'chat.new-message.server'` and
  `'chat.remove-message.server'`, **but not** `'chat.new-message.local'`.

- `'#'`: Greedy wild card. Must be the last section in the pattern.
  Will match one or more sections at the end of the topic. For example,
  `'chat.#'` will match `'chat.new-message.server'`,
  `'chat.remove-message.server'` **and** `'chat.new-message.local'`. Basically
  it will match any topic that begins with `'chat.'`.
