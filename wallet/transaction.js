const ChainUtil = require("../chain-util");
const {MINING_REWARD} = require("../config");

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);
        if (amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balannce`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount, address: recipient});
        Transaction.signTransaction(this, senderWallet);
        return this;
    }

    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance ${senderWallet.balance}`);
            return null;
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        ]);
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;

    }

    static rewardTransaction(minerWallet, blockChainWallet) {
        return Transaction.transactionWithOutputs(blockChainWallet, [
            {amount: MINING_REWARD, address: minerWallet.publicKey}
        ]);
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignatur(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;

