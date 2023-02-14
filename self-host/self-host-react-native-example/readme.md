## React TKey React Native Example
## Prerequisites

- [Node.js > 12](https://nodejs.org) and npm (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- [Xcode 12](https://developer.apple.com/xcode)
- [Cocoapods 1.10.1](https://cocoapods.org)

changes done:
1. metro.config.js -> using node-libs-react-native (https://www.npmjs.com/package/node-libs-react-native) to provide polyfilled libs for React Native compatible implementations of Node core modules like stream, http, etc..
2. global.js -> have global variables which will be required for toruslabs packages to work in react native context


steps to run sample app:
1. yarn install
2. cd ios && pod install
3. yarn ios

what features are there in app?
1. Login - uses customauth google login
2. Store device share - Store the 2nd share in async storage
3. backup share - security question share 