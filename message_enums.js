var enums = {
  //Commands received from the container manager
  command: {
    1: 'SHUT_DOWN'          //Shut Down. Currently the only implemented command. All Applications must implement this command.
                            //This command is used when an updated Application is deployed. The Container Manager will send a shutdown
                            //command for the running Application to stop everything it is doing before re-starting the Application.
  },
  //Statuses to report to the Container Manager
  status: {
    'MSG_OK': 1,            //the Application is running normally.

    'MSG_FAIL': 2,          //the Application has failed. The Container Manager will restart the container. If the key “Message”
                            //is present in the JSON object it will be stored in the Data Storage Application as an error message.

    'MSG_ERR': 3,           //the same as MSG_FAIL for backwards compatibility.

    'SHUT_DWN': 4,          //the Application has completed its shutdown procedures and is ready to be stopped by the
                            //Container Manager. The container will not be restarted unless the Container Manager configuration is
                            //altered or the Container Manager is re-started.

    'INITIAL': 5,           //the Application is waiting to receive its configuration (and can do nothing until it does). The
                            //Container Manager will resend the Application's configuration.

    'RESTART': 6            //the Application wishes to be re-started. It has completed any shutdown procedures and saving of
                            //state and is ready to be stopped and started again by the Container Manager.
  },
  //Error types to be logged in the data container
  error: {
    'JSON_INVALID': 1,      //Payload from MQTT failed to Parse. Invalid JSON.

    'IO': 2,                //Input/output Error

    'ACCESS': 3,            //Permission denied

    'NO_DEVICE': 4,         //No device found

    'FILE_DIRECTORY': 5,    //Directory not found

    'MQTT_SUBSCRIPTION': 6, //Failed subscription to MQTT Topic

    'MQTT_PUBLISH': 7,      //Failed Publish, this is only used when trying to publish a payload to. If failed to publish an error
                            //message use std::out. This will be saved by the Docker Log files and can be accessed later by Admin.

    'APPLICATION': 8,       //Process failed due to Application error. The message to accompany this Errno is mandatory.

    'CONFIGURATION': 9,     //Failed processing the incoming Config. This is if the contents of the configuration expected does not
                            //match or has the wrong types. (This could also be ERROR_JSON_INVALID if it’s not valid JSON)

    'MQTT_CABLLBACK': 10,   //Error occurred in the MQTT Call back. This can be when setting up the call back or an error within the
                            //call back with an incoming message

    'SENSOR': 11,           //This can have two applications. The first, for any Sensor Container that has an error with reading a
                            //sensor it can output this Errno with the relevant message.
                            //The second is for any Algorithm Container reading in the Sensor Payload and the Payload is valid but
                            //any of the Key types is incorrect.

    'NETWORK': 12,          //Error accessing the network.

    'PORT': 13,             //Error opening or accessing a port.

    'PROFILE': 14           //Any Algorithm Application expecting a Profile Payload, the Payload is valid but any of the Key types is
                            //incorrect.
  }
};

module.exports = enums;
