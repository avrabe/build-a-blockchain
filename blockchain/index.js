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
        chain.forEach(function (element, index) {
            if (index === 0) {
                ret = ret && Block.isSameGenesisBlock(element, this.chain[0]);
            } else {
                const lastBlock = chain[index - 1];
                ret = ret && Block.isBlockValid(element, lastBlock);
            }
        }, this);

        return ret;
    }

    replaceChain(newChain, checkValidity = true) {
        if (checkValidity) {
            if (newChain.length <= this.chain.length) {
                console.log("Received chain is not longer than the current chain");
                return;
            } else if (!this.isValidChain(newChain)) {
                console.log("The received chain is not valid");
                return;
            }
        }
        console.log("Replacing blockchain with new chain.");
        this.chain = newChain;
    }
}

module.exports = Index;