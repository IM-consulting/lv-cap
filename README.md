# lv-cap
NPM package for interfacing with the Common Application Platform for Low Voltage
Networks (LV-CAP). This README covers:

* [Overview](#overview)
* [Installation](#installation)
* [Example Usage](#example-usage)
* [API](#api)
* [License](#license)

# Overview
LV-CAP runs Docker containers which are controlled by a Container Manager (CM)
via the MQTT protocol. This package is meant for developers creating node.js
containers and handles LV-CAP requirements for:

* Basic startup/shutdown procedures
* MQTT management
* Responding to commands/requests from the CM

# Installation
```sh
npm install lv-cap
```
# Example Usage
```js
var lvcap = require('lv-cap');

var options = {
  containerId: 'vendor_appName_instance',
  keyPath: './private_key.pem',
  certPath: './certificate.pem'
  debug: true,
  rejectUnauthorized: true
};

var configurationCB = function (newConfig) {
  //run your application init code here

};

var shutdownCB = function () {
  //run your application shutdown code here
}

lvcap.init(options, configurationCB, shutdownCB);
```

# API

* [`lvcap.start()`](#start)
* [`lvcap.stop()`](#stop)
* [`lvcap.setStatus()`](#setStatus)
* [`lvcap.publish()`](#publish)
* [`lvcap.pubError()`](#pubError)
* [`lvcap.subscribe()`](#subscribe)
* [`lvcap.unsubscribe()`](#unsubscribe)
* [`lvcap.cleanupSubs()`](#cleanup)
* [`lvcap.config`](#config)
* [`lvcap.messages`](#messages)

<a name="start"></a>
### lvcap.start(options, configurationCallback, [shutdownCallback])
Containers running on LV-CAP are required to connect to the CM and receive
configuration before initializing any custom code. Thus, `start` must be the
first code your container runs, with your specific init code inside of
`configurationCallback`. The CM can send configuration multiple times, and the
`configurationCallback` will be called each time; so make sure your init code is
ready for this.

The arguments are:

* `options` for connecting to the MQTT broker
  * `containerId` is the ID assigned to your container by the LV-CAP admin
  * `keyPath`: relative path to private key file
  * `certPath`: relative path to certificate file
  * `debug`: `false`, set to true if you want to console.log() events (optional)  
  * `rejectUnauthorized`: `false`, set to true for production (optional)
* `configurationCallback` is called when valid configuration is received from  
    the CM. You can access this configuration at [`lvcap.config`](#config)
* `shutdownCallback` is called when a shutdown command is received and before  
    the MQTT connection is closed. This is where you should perform any data
    cleanup necessary, subscriptions are automatically cleaned up.

<a name="stop"></a>
### lvcap.stop()
Manually shutdown the MQTT client and unsubscribe from all active subscriptions.
This is what is called when a shutdown command is received from the CM.

<a name="setStatus"></a>
### lvcap.setStatus(status, [errorMessage], [callback])
Set a `status`, and publish it to the CM. Choose the appropriate status text from
the [enumerated list](./message_enums.js#L8). For `MSG_FAIL` and `MSG_ERR` be
sure to set `errorMessage`.

If you want to use a `callback` without an `errorMessage`, be sure to pass
`undefined` as the second argument.

<a name="publish"></a>
### lvcap.publish(topic, message, [settings], [callback])
Publish a `message` to an MQTT `topic`, with optional `settings` passed directly
to the MQTT package's
[publish function](https://www.npmjs.com/package/mqtt#publish).

If you want to use a `callback` without changing default `settings`, be sure to
pass `{}` as the third argument.

<a name="pubError"></a>
### lvcap.pubError(error, [message], [callback])
Publish an `error` with an optional error `message` Choose the appropriate
error text from the [enumerated list](./message_enums.js#L27).

If you want to use a `callback` without a `message`, be sure to pass `undefined`
as the second argument.

<a name="subscribe"></a>
### lvcap.subscribe(topic, [onMessage], [callback])
Subscribe to an MQTT `topic`. `onMessage` is called with a `message` as its only
argument when received on `topic`, the third argument is called on verification
of a successful subscription.

You will not be able to subscribe to certain topics, as they are used by the CM:
```
'#', 'status/#', 'config/#', 'command/#'
```

If you resubscribe to the same topic, only the most recent `onMessage` callback
will be triggered.

If you want to use a `callback` without an `onMessage` callback, be sure to pass
`undefined` as the second argument.

<a name="unsubscribe"></a>
### lvcap.unsubscribe(topic, [callback])
Unsubscribe from an MQTT `topic`.

You will not be able to unsubscribe from certain topics, as they are used by the
CM:
```
'#', 'status/#', 'config/#', 'command/#'
```

<a name="cleanup"></a>
### lvcap.cleanupSubs()
Manually unsubscribe and remove callbacks from all MQTT subscriptions made via
[`lvcap.subscribe()`](#subscribe).

<a name="config"></a>
### lvcap.config
A JS object containing the most recently received configuration from the CM.

<a name="messages"></a>
### lvcap.messages
An array containing all messages received from the MQTT broker that are from
topics subscribed to via [`lvcap.subscribe()`](#subscribe) without any
`onMessage` callbacks.

# License
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
