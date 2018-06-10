# build-a-blockchain

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2f7e41fe94d446969d61714209d96e6b)](https://app.codacy.com/app/avrabe/build-a-blockchain?utm_source=github.com&utm_medium=referral&utm_content=avrabe/build-a-blockchain&utm_campaign=badger)
[![Build Status](https://travis-ci.org/avrabe/build-a-blockchain.svg?branch=master)](https://travis-ci.org/avrabe/build-a-blockchain)

This is a implementation of a block chain algorithm based on the udemy class [Build a Blockchain and a Cryptocurrency from Scratch](https://www.udemy.com/build-blockchain/).

## Setup
To start the initial client you have to setup following:

```javascript
npm install
npm run start
```

Additional clients need to be configured and started with some options:

```javascript
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 INIT_WITH_REMOTE_BLOCKCHAIN=true npm run start
```

## Additions / changes to the class
### Genesis Block
The genesis block is signed with a generated key. This is to be able to reflect that there should be some trust behind the genesis block.
Especially when running the P2PServer it will be necessary to synchronize with the "true" genesis block as otherwise
each p2pserver will have it's own and no synchronisation will happen. 

To indicate this each p2pServer need to set the environment variable `INIT_WITH_REMOTE_BLOCKCHAIN` to get the "True" genesis block.

