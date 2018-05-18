const NodeRSA = require("node-rsa");
const sha256 = require("crypto-js/sha256");

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    toString() {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash:      ${this.hash.substring(0, 10)}
            Data:      ${this.data}`;
    }

    static genesis() {
        const key = new NodeRSA({b: 512});
        const timestamp = Date.now();
        const text = "Genesis block!";
        const encrypted = key.encrypt(text, "base64");
        const data = `${text} ${encrypted}`;
        const lastHash = "-------";
        const hash = Block.hash(timestamp, lastHash, data);
        return new this(timestamp, lastHash, hash, data);
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);
        return new this(timestamp, lastHash, hash, data);
    }

    static blockHash(block) {
        const {timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    }

    static isSameGenesisBlock(block1, block2) {
        return (JSON.stringify(block1) === JSON.stringify(block2));
    }

    static isBlockValid(block, lastBlock) {
        return !(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block));
    }

    static hash(timestamp, lastHash, data) {
        return sha256(`${timestamp}${lastHash}${data}`).toString();
    }
}

module.exports  = Block;