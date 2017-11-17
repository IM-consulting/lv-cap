var lvcap = require('./lvcap.js');

/*******************************
lvcap options:
  containerId -- LV-CAP container ID (required)
  debug -- set to true for console logs
  MQTTS --  set to true to secure the MQTT connection
    keyPath -- path to private key file (required if MQTTS)
    certPath -- path to certificate file (required if MQTTS)
*******************************/

var init = function (options, configCB, shutdownCB) {
  if (!options.containerId)
    throw new Error('No containerId in lv-cap options');

  var lvcapOptions = {
    debug: options.debug || false,
    containerId: options.containerId,
    mqtt: {}
  };

  if (options.MQTTS) {
    if (!options.keyPath)
      throw new Error('No private key path for MQTTS');
    if (!options.certPath)
      throw new Error('No certificate path for MQTTS');

    var fs = require('fs');
    lvcapOptions.MQTT = {
      protocolID: 'MQTTS'
    };

    try {
      lvcapOptions.key = fs.readFileSync(options.keyPath);
    }
    catch (e) {
      throw new Error(e);
    }
    try {
      lvcapOptions.cert = fs.readFileSync(options.certPath);
    }
    catch (e) {
      throw new Error(e);
    }
  }
  lvcap.startup(lvcapOptions, configCB, shutdownCB);
};

module.exports = {
  start: init,
  stop: lvcap.shutdown,
  setStatus: lvcap.setStatus,
  publish: lvcap.pubWrapper,
  pubError: lvcap.pubError,
  subscribe: lvcap.subWrapper,
  unsubscribe: lvcap.unsubWrapper,
  config: lvcap.config,
  messages: lvcap.messages
};
