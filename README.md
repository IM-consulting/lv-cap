# lv-cap
NPM package for interfacing with the Common Application Platform for Low Voltage
Networks (LV-CAP)

# Overview
LV-CAP runs Docker containers which are controlled by a Container Manager (CM)
via the MQTT protocol. This package is meant for developers creating node.js
containers and handles LV-CAP requirements for:

* Basic startup/shutdown procedures
* MQTT management
* Responding to commands/requests from the CM

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
### lvcap.start(options, [configurationCallback], [shutdownCallback])

<a name="stop"></a>
### lvcap.stop()

<a name="setStatus"></a>
### lvcap.setStatus(status, errorMessage, [callback])

<a name="publish"></a>
### lvcap.publish(topic, message, [callback])

<a name="pubError"></a>
### lvcap.pubError(error, message, [callback])

<a name="subscribe"></a>
### lvcap.subscribe(topic, [callback])

<a name="unsubscribe"></a>
### lvcap.unsubscribe(topic, [callback])

<a name="config"></a>
### lvcap.config

<a name="messages"></a>
### lvcap.messages
