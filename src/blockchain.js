const SHA256 = require('crypto-js/sha256');

const Block = require('./block');

class BlockChain {

  constructor() {
    this.chain = [];
    this.height = -1;
    this.initializeChain();
  }

  async initializeChain() {
    if (this.height === -1) {
      let block = new Block({ data: 'Genesis Block'.toUpperCase() });
      await this.addBlock(block);
    }
  }

  async addBlock(block) {
    let self = this;
    return new Promise(async (resolve, reject) => {
      block.height = self.chain.length;
      block.time = new Date().getTime().toString().slice(0, -3);

      if (self.chain.length > 0) {
        block.previousBlockHash = self.chain[self.chain.length - 1].hash;
      }

      let errors = await self.validateChain();

      if (errors.length > 0) {
        reject(new Error('The chain is not valid:', errors));
      }

      block.hash = SHA256(JSON.stringify(block)).toString();

      self.chain.push(block);
      resolve(block);
    });
  }

  validateChain() {
    let self = this;
    const errors = [];

    return new Promise(async (resolve) => {
      self.chain.map(async (block) => {
        try {
          let isValid = block.validate();
          if (!isValid) {
            errors.push(new Error(`The block ${block.height} is not valid`));
          }
        } catch (err) {
          errors.push(err);
        }
      });

      resolve(errors);
    });
  }

  print() {
    let self = this;
    for (let i of self.chain) {
      console.log(i.toString());
    }
  }

}

module.exports = BlockChain;
