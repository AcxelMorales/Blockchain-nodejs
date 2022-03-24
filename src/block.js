const SHA256 = require('crypto-js/sha256');
const Hex2ascii = require('hex2ascii');

class Block {

  constructor(data) {
    this.hash = null;
    this.height = 0;
    this.body = Buffer.from(JSON.stringify(data).toString('hex'));
    this.time = 0;
    this.previousBlockHash = '';
  }

  validate() {
    const self = this;
    return new Promise((resolve) => {
      let currentHash = self.hash;

      self.hash = SHA256(JSON.stringify({ ...self, hash: null }));

      if (currentHash !== self.hash) return resolve(false);

      resolve(true);
    });
  }

  getBlockData() {
    const self = this;
    return new Promise((resolve, reject) => {
      let encodedData = self.body;
      let decodedData = Hex2ascii(encodedData);
      let objData = JSON.parse(decodedData);

      if (objData === 'GENESIS BLOCK') return reject(new Error('This is genesis block'));

      resolve(true);
    });
  }

  toString() {
    const { hash, height, body, time, previousBlockHash } = this;
    return `
      ==========================================================
      Block:
      Hash: ${hash},
      Height: ${height},
      Body: ${body},
      Time: ${time},
      PreviousBlockHash: ${previousBlockHash}
      ==========================================================-
    `;
  }

}

module.exports = Block;
