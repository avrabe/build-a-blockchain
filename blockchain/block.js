const NodeRSA = require("node-rsa");
const ChainUtil = require("../chain-util");

const {DIFFICULTY, MINE_RATE} = require("../config");

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    static genesis() {
        const key = new NodeRSA({b: 512});
        const timestamp = Date.now();
        const text = "Genesis block!";
        const encrypted = key.encrypt(text, "base64");
        const data = [`${text} ${encrypted}`];
        const lastHash = "-------";
        const hash = Block.hash(timestamp, lastHash, data, 0);
        return new this(timestamp, lastHash, hash, data, 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let nonce = 0;
        let hash;
        let timestamp = Date.now();
        let difficulty = Block.adjustDifficulty(lastBlock, timestamp);
        do {
            nonce++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static blockHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, none, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${none}${difficulty}`);
    }

    static isSameGenesisBlock(block1, block2) {
        return (JSON.stringify(block1) === JSON.stringify(block2));
    }

    static isBlockValid(block, lastBlock) {
        return !(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block));
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let {difficulty, timestamp} = lastBlock;
        difficulty = timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }

    toString() {
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash:      ${this.hash.substring(0, 10)}
            Nonce:     ${this.nonce}
            Difficulty:${this.difficulty}
            Data:      ${this.data}`;
    }
}

module.exports  = Block;