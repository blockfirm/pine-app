Pine Wallet
===========

[![GitHub Release](https://img.shields.io/github/release/blockfirm/pine-app.svg?style=flat-square)](https://github.com/blockfirm/pine-app/releases)
[![Build Status](https://img.shields.io/travis/blockfirm/pine-app.svg?branch=master&style=flat-square)](https://travis-ci.org/blockfirm/pine-app)
[![Coverage Status](https://img.shields.io/coveralls/blockfirm/pine-app.svg?style=flat-square)](https://coveralls.io/r/blockfirm/pine-app)

[Pine](https://pine.pm) is an open-source bitcoin wallet for sending and receiving money among your friends.

> [!WARNING]  
> **This project is not actively developed.** Use with caution. To recover a Pine wallet, see [RECOVERY.md](RECOVERY.md).

## Getting Started

### Install XCode from the App Store

<https://apps.apple.com/se/app/xcode/id497799835?l=en&mt=12>

### Install nvm:

[nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) is used to install different versions
of Node.js and npm. Follow these instructions to install nvm:

<https://github.com/nvm-sh/nvm#install--update-script>

### Install Node.js

Install [Node.js](https://nodejs.org) (`v8`) using nvm:

	$ nvm install v8

### Install Yarn

This project is using [Yarn](https://yarnpkg.com) as a package manager instead of npm.

	$ npm install -g yarn

Or follow the instructions here: <https://yarnpkg.com/en/docs/install>

### Install CocoaPods

[CocoaPods](https://cocoapods.org) is used as a dependency manager for the iOS project.
Install it using the following command:

    $ sudo gem install cocoapods

### Clone the project

    $ git clone https://github.com/blockfirm/pine-app.git
    $ cd pine-app

### Install dependencies

	$ yarn install
    $ cd ios
    $ pod install

### Start the React Native bundler

Start the bundler ([Metro](https://facebook.github.io/metro/)):

    $ yarn start

### Start the iOS application

Open `ios/Pine.xcworkspace` with XCode and build and run the app in a simulator or real device.

## Build for production

1. **[Enable App Transport Security](https://facebook.github.io/react-native/docs/running-on-device#1-enable-app-transport-security)**

    Remove `localhost` from `NSExceptionDomains` in `ios/Info.plist`.

2. **[Configure release scheme](https://facebook.github.io/react-native/docs/running-on-device#2-configure-release-scheme)**

    In Xcode, go to **Product** → **Scheme** → **Edit Scheme** and set *Build Configuration* to `Release`.

3. **Configure node binary**

    It is possible that the build fails with an error complaining about the js bundle missing. This is
    solved by going to **Pine** → **Build Phases** → **Bundle React Native code and images** and replacing
    `node` with the full path to your node binary (the result of `which node`).

4. **[Build react-native-image-crop-picker](https://github.com/ivpusic/react-native-image-crop-picker#production-build)**

    1. Remove the `RSKImageCropper` and `QBImagePicker` frameworks from **Pine** → **General** → **Embedded Binaries**
    2. Pick **🔨 Generic iOS Device** in the *Product Destination* dropdown and then build (`⌘B`)
    3. Add the newly built `RSKImageCropper` and `QBImagePicker` frameworks to **Embedded Binaries**

5. **Build the app**

    Pick **🔨 Generic iOS Device** in the *Product Destination* dropdown and then build (`⌘B`).

## Contributing

Want to help us making Pine better? Great, but first read the
[CONTRIBUTING.md](CONTRIBUTING.md) file for instructions.

## Licensing

Pine is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for full license text.
