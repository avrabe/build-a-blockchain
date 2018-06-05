const NodeRSA = require("node-rsa");
const sha256 = require("crypto-js/sha256");
const {DIFFICULTY} = require("../config");

class Block {
    constructor(timestamp, lastHash, hash, data, nonce) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    static genesis() {
        const key = new NodeRSA({b: 512});
        const timestamp = Date.now();
        const text = "Genesis block!";
        const encrypted = key.encrypt(text, "base64");
        const data = `${text} ${encrypted}`;
        const lastHash = "-------";
        const hash = Block.hash(timestamp, lastHash, data, 0);
        return new this(timestamp, lastHash, hash, data, 0);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let nonce = 0;
        let hash;
        let timestamp;
        do {
            nonce++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce);
        } while (hash.substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY));

        return new this(timestamp, lastHash, hash, data, nonce);
    }

    static blockHash(block) {
        const {timestamp, lastHash, data, nonce} = block;
        return Block.hash(timestamp, lastHash, data, nonce);
    }

    static hash(timestamp, lastHash, data, none) {
        return sha256(`${timestamp}${lastHash}${data}${none}`).toString();
    }

    static isSameGenesisBlock(block1, block2) {
        return (JSON.stringify(block1) === JSON.stringify(block2));
    }

    static isBlockValid(block, lastBlock) {
        return !(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block));
    }

    toString() {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash:      ${this.hash.substring(0, 10)}
            Nonce:     ${this.nonce}
            Data:      ${this.data}`;
    }
}

module.exports  = Block;