const Blockchain = require("./blockchain");

const bc = new Blockchain();
for (let i = 0; i < 30; i++) {
    console.log(bc.addBlock(`foo ${i}`).toString());
}