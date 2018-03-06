Wallet ID
=========

An iOS app that stores a private key but never exposes it. Instead it has an API that allows other
apps to sign transactions with it.

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

## Contributing

Want to help us making Wallet ID better? Great, but first read the
[CONTRIBUTING.md](CONTRIBUTING.md) file for instructions.

## Licensing

Wallet ID is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for full license text.
