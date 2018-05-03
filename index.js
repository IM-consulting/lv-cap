var lvcap = require('./lvcap.js');
var fs = require('fs');

/*******************************
init arguments:
  options {
    containerId         -- LV-CAP container ID (required)
    keyPath             -- filepath to MQTTS key (required)
    certPath            -- filepath to MQTTS certificate (required)
    debug               -- set to true for debug logging (optional)
    rejectUnauthorized  -- set to true for prduction certs
  }
  configCB() -- callback whenever the CM sends a container configuration message
  shutdownCB() -- callback before MQTT client is terminated, tidy up here
*******************************/

var init = function (options, configCB, shutdownCB) {
  if (!options.containerId)
    throw new Error('No containerId in lv-cap options');
  if (!options.keyPath)
    throw new Error('No private key path for MQTTS');
  if (!options.certPath)
    throw new Error('No certificate path for MQTTS');

  var lvcapOptions = {
    debug: options.debug || false,
    containerId: options.containerId,
    connection: {
      port: 8883,
      host: 'localhost',
      protocol: 'mqtts',
      rejectUnauthorized: options.rejectUnauthorized || false
        //false for self signed certs (development)
        //true for full certs (production)
    }
  };

  try {
    lvcapOptions.connection.key = fs.readFileSync(options.keyPath);
  }
  catch (e) {
    throw new Error(e);
  }
  try {
    lvcapOptions.connection.cert = fs.readFileSync(options.certPath);
  }
  catch (e) {
    throw new Error(e);
  }

  lvcap.startup(lvcapOptions, configCB, shutdownCB);
};

module.exports = {
  start: init,
  stop: lvcap.shutdown,
  setStatus: lvcap.setStatus,
  publish: lvcap.publish,
  pubError: lvcap.pubError,
  subscribe: lvcap.subscribe,
  unsubscribe: lvcap.unsubscribe,
  config: lvcap.config,
  messages: lvcap.messages
};
