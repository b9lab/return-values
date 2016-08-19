web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
  var transactionReceiptAsync;
  interval |= 500;
  transactionReceiptAsync = function(txnHash, resolve, reject) {
    try {
      var receipt = web3.eth.getTransactionReceipt(txnHash);
      if (receipt == null) {
        setTimeout(function () {
          transactionReceiptAsync(txnHash, resolve, reject);
        }, 500);
      } else {
        resolve(receipt);
      }
    } catch(e) {
      reject(e);
    }
  };

  return new Promise(function (resolve, reject) {
    transactionReceiptAsync(txnHash, resolve, reject);
  });
};

contract('Caller bad calls', function(accounts) {

  it("calling bad version does not return expected values", function() {

    var caller = Caller.deployed();
    var tool = Tool.deployed();

    return tool.number()
      // We can call a public field
      .then(function (number) {
        assert.equal(number, 0, "number should start at 0");
        return tool.setNumber(2, { from: accounts[0] });
      })
      .then(function (tx) {
        return web3.eth.getTransactionReceiptMined(tx);
        // Waiting for it to be mined
      })
      .then(function (receipt) {
        return tool.number();
      })
      .then(function (number) {
        assert.equal(number, 2, "number should now be 2");
        return tool.numberIsEven.call();
        // Because it is a .call, we get the return value
      })
      .then(function (isEven) {
        assert.isTrue(isEven, "number should be said even");
        return caller.saved();
      })
      .then(function (saved) {
        assert.equal(saved, 42, "saved should start at 42");
        return caller.getNumberIfEvenBad.call({ from: accounts[0] });
        // Because it is a .call, we get the return value
        // But there is an inner call to tool.numberIsEven()
      })
      .then(function (saved) {
        assert.equal(saved, 2, "should get the number because it is even");
        return caller.getNumberIfEvenBad({ from: accounts[0] });
        // Because it is a direct call, we get the txn
      })
      .then(function (tx) {
        return web3.eth.getTransactionReceiptMined(tx);
      })
      .then(function (receipt) {
        return caller.saved();
      })
      .then(function (saved) {
        assert.equal(saved, 2, "should have been updated to the number too");
        return tool.setNumber(3, { from: accounts[0] });
      })
      .then(function (tx) {
        return web3.eth.getTransactionReceiptMined(tx);
      })
      .then(function (receipt) {
        return tool.number();
      })
      .then(function (number) {
        assert.equal(number, 3, "number should now be 3");
        return tool.numberIsEven.call({ from: accounts[0] });
      })
      .then(function (isEven) {
        assert.isFalse(isEven, "number should be said odd now");
        return caller.getNumberIfEvenBad.call({ from: accounts[0] });
        // Because it is a .call, we get the return value
      })
      .then(function (saved) {
        // --> That's where it is weird!!
        // We get the unchanged saved value
        assert.equal(saved.valueOf(), 2, "should still get 2 because it is the unchanged saved value");
        return caller.getNumberIfEvenBad({ from: accounts[0] });
        // Because it is a direct call, we get the txn
      })
      .then(function (tx) {
        return web3.eth.getTransactionReceiptMined(tx);
      })
      .then(function (receipt) {
        return caller.saved();
      })
      .then(function (saved) {
        // But when checking after a transaction, the proper value was saved...
        assert.equal(saved, 0, "should have been updated to 0 too");
      });

  });

});
