# Smart Home Control

A simple app for the Cordova OCF plugin, that interfaces with a smart home prototype.


# In short

This app uses the [cordova-plugin-ocf](https://github.com/siovene/cordova-plugin-ocf/) and therefore the [Iotivity project](https://www.iotivity.org/) to control a Smart Home prototype.


# Build instructions

You will need:
 - nodejs, v5 or above
 - The Android SDK, version 21 or above
 - And ARM or x86 Android device (the emulator won't do)

 ```bash
 sudo npm install -g cordova grunt-cli bower
 npm install
 bower install
 grunt platform:add:android
 grunt run
 ```


# How to discover resources

Please refer to [here] to learn about detailed steps.

This demo currently supports the following sensors : `Button, Buzzer, Mini Fan, Gas(MQ2), Ambient Light, Led, Motion, RGB Led, Solor, Switch(P) and Temperature`.

After the discovery process, this demo can read and control the status of the discovered resources.

[here]: https://github.com/siovene/cordova-plugin-ocf-demo/blob/master/README.md#how-to-discover-resources
