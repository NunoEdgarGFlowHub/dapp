/* eslint no-unused-expressions: "off" */
/* globals describe, it, before, beforeEach */

"use strict";

const contracts = require('../modules/contracts')
const chaithereum = require('chaithereum')

before(() => {
  return chaithereum.promise
})

describe('Filestore', () => {

  const file = '0x03'
  const fileHash = chaithereum.web3.sha3(file)

  let filestore

  it('successfully instantiates', () => {
    return chaithereum.web3.eth.contract(contracts.Filestore.abi).new.q({ data: contracts.Filestore.bytecode }).then((_filestore) => {
      filestore = _filestore
    }).should.be.fulfilled
  })

  it('has a non-zero address', () => {
    chaithereum.chai.expect(filestore.address).to.be.address
    chaithereum.chai.expect(filestore.address).to.not.be.zeros
  })

  it('can store file', (done) => {
    filestore.Store({ fileHash: fileHash }).watch((e, result) => {
      chaithereum.chai.expect(result.args.file).to.equal(file)
      done(e)
    })
    filestore.store.q(file)
  })

  it('can retreive file block number', (done) => {
    chaithereum.web3.Q.all([
      filestore.getBlockNumber.q(fileHash),
      chaithereum.web3.eth.getBlockNumber.q()
    ]).then((results) => {
      try {
        results[0].should.bignumber.equal(results[1])
        done()
      } catch (e) {
        done(e)
      }
    })
  })

})