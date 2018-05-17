const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
    let bc, bc2;
    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it("starts with genesis block", () => {
        expect(bc.chain[0].lastHash).toEqual(Block.genesis().lastHash);
    });

    it("adds a new block", () => {
        const data = "foo";
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
    });

    it("validates a valid chain", () => {
        bc2.chain[0] = bc.chain[0];
        bc2.addBlock("foo");
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it("invalidates a chain with corrupt genesis block", () => {
        bc2.chain[0] = Object.assign({}, bc.chain[0]);
        bc2.chain[0].data = "Bad data";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it("invalidates a chain with a different genesis block", () => {
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it("invalidates a corrupte chain", () => {
        bc2.chain[0] = bc.chain[0];
        bc2.addBlock("foo");
        bc2.chain[1].data = "Not foo";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it("replaces the chain with a valid chain", () => {
        bc2.chain[0] = bc.chain[0];
        bc2.addBlock("goo");
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });

    it("does not replaces the chain with one or less than or equal to length", () => {
        bc.addBlock("foo");
        bc2.chain[0] = bc.chain[0];
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });

});