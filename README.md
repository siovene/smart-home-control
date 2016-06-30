# Smart Home Control

A simple app for the Cordova OCF plugin, that interfaces with a smart home prototype.


# In short

This app uses the [cordova-plugin-oic](https://github.com/siovene/cordova-plugin-oic/) and therefore the [Iotivity project](https://www.iotivity.org/) to control a Smart Home prototype.


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
