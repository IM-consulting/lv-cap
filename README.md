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
  containerId: 'vendor_appName_appVersion',
  debug: true,
  MQQTS: true,
  keyPath: './private_key.pem',
  certPath: './certificate.pem'
};

var configurationCB = function () {
  //run your application init code here
  var config = lvcap.config; //access the received configuration
};

var shutdownCB = function () {
  //run your application shutdown code here, eg. unsubscribe from topics
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
* [`lvcap.config`](#config)
* [`lvcap.messages`](#messages)

<a name="start"></a>
### lvcap.start(options, configurationCallback, [shutdownCallback])
Containers running on LV-CAP are not allowed to do anything until an MQTT
connection is initialized and a configuration package is sent to the container.
Thus, `start` should be the first code your container runs, with your specific
init code inside of `configurationCallback`. The CM might send configuration
multiple times, and the `configurationCallback` will be called each time; so
make sure your init code is ready for this.

The arguments are:

* `options` is an object that sets details for the MQTT connection and CM
  * `containerId` is the ID assigned to your container by the LV-CAP admin, this  
      is the only required option.
  * `debug`: `false`, set to true if you want to console.log() events
  * `MQTTS`: `false`, set to true for secured (tls) MQTT communications
  * `keyPath`: relative path to private key file, only used for MQTTS
  * `certPath`: relative path to certificate file, onlye used for MQTTS
* `configurationCallback` is called when valid configuration is received from  
    the CM. You can access this configuration at [`lvcap.config`](#config)
* `shutdownCallback` is called when a shutdown command is received and before  
    the MQTT connection is closed. This is where you should unsubscribe to any  
    topics you subscribed to, and perform any data cleanup necessary.

<a name="stop"></a>
### lvcap.stop()
Manually shutdown the MQTT client, after unsubscribing to the default topics.
This is what is called when a shutdown command is received from the CM.

<a name="setStatus"></a>
### lvcap.setStatus(status, [errorMessage], [callback])
Set a `status`, and publish it to the CM. Choose the appropriate status text from
the [enumerated list](./message_enums.js#L8). For `MSG_FAIL` and `MSG_ERR` be
sure to set `errorMessage`.

If you want to use a `callback` without an `errorMessage`, be sure to pass
`undefined` as the second argument.

<a name="publish"></a>
### lvcap.publish(topic, message, [callback])
Publish a `message` to an MQTT `topic`.

<a name="pubError"></a>
### lvcap.pubError(error, [message], [callback])
Publish an `error` with an optional error `message` Choose the appropriate
error text from the [enumerated list](./message_enums.js#L27).

If you want to use a `callback` without a `message`, be sure to pass `undefined`
as the second argument.

<a name="subscribe"></a>
### lvcap.subscribe(topic, [callback])
Subscribe to an MQTT `topic`.

<a name="unsubscribe"></a>
### lvcap.unsubscribe(topic, [callback])
Unsubscribe from an MQTT `topic`.

<a name="config"></a>
### lvcap.config
A JS object containing the most recently received configuration from the CM.

<a name="messages"></a>
### lvcap.messages
An array containing all unrecognized messages received from the MQTT broker.

# License
[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
