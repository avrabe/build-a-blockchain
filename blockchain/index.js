const Block = require("./block");

class Index {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain) {
        let ret = true;
        ret = ret && Block.isSameGenesisBlock(chain[0], this.chain[0]);
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            ret = ret && block.isBlockValid(lastBlock);
        }
        return ret;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log("Received chain is not longer than the current chain");
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log("The received chain is not valid");
            return;
        }
        console.log("Replacing blockchain with new chain.");
        this.chain = newChain;
    }
}

module.exports = Index;