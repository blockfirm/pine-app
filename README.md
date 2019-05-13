Pine Wallet
===========

[![GitHub Release](https://img.shields.io/github/release/blockfirm/pine-app.svg?style=flat-square)](https://github.com/blockfirm/pine-app/releases)
[![Build Status](https://img.shields.io/travis/blockfirm/pine-app.svg?branch=master&style=flat-square)](https://travis-ci.org/blockfirm/pine-app)
[![Coverage Status](https://img.shields.io/coveralls/blockfirm/pine-app.svg?style=flat-square)](https://coveralls.io/r/blockfirm/pine-app)

[Pine](https://pinewallet.co) is an open-source bitcoin wallet for sending and receiving money among your friends.

## Getting Started

### Install Node.js

Install [Node.js](https://nodejs.org) (`v8`) using [nvm](https://github.com/creationix/nvm):

	$ nvm install v8

### Install Yarn

This project is using [Yarn](https://yarnpkg.com) as a package manager instead of npm.

	$ brew install yarn --without-node

Or follow the instructions here: <https://yarnpkg.com/en/docs/install>

### Install dependencies

	$ yarn install
	$ yarn global add react-native-cli
	$ react-native link

### Start the iOS application

	$ react-native run-ios

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
