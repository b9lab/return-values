Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('Caller bad calls', function(accounts) {

    it("calling bad version does not return expected values", function() {

        var caller = Caller.deployed();
        var tool = Tool.deployed();

        return tool.number()
            // We can call a public field
            .then(number => {
                assert.equal(number, 0, "number should start at 0");
                return tool.setNumber(2, { from: accounts[0] });
            })
            .then(web3.eth.getTransactionReceiptMined)
            .then(receipt => tool.number())
            .then(number => {
                assert.equal(number, 2, "number should now be 2");
                return tool.numberIsEven.call();
                // Because it is a .call, we get the return value
            })
            .then(isEven => {
                assert.isTrue(isEven, "number should be said even");
                return caller.saved();
            })
            .then(saved => {
                assert.equal(saved, 42, "saved should start at 42");
                return caller.getNumberIfEvenBad.call({ from: accounts[0] });
                // Because it is a .call, we get the return value
                // But there is an inner call to tool.numberIsEven()
            })
            .then(saved => {
                assert.equal(saved, 2, "should get the number because it is even");
                return caller.getNumberIfEvenBad({ from: accounts[0] });
                // Because it is a direct call, we get the txn
            })
            .then(web3.eth.getTransactionReceiptMined)
            .then(receipt => caller.saved())
            .then(saved => {
                assert.equal(saved, 2, "should have been updated to the number too");
                return tool.setNumber(3, { from: accounts[0] });
            })
            .then(web3.eth.getTransactionReceiptMined)
            .then(receipt => tool.number())
            .then(number => {
                assert.equal(number, 3, "number should now be 3");
                return tool.numberIsEven.call({ from: accounts[0] });
            })
            .then(isEven => {
                assert.isFalse(isEven, "number should be said odd now");
                return caller.getNumberIfEvenBad.call({ from: accounts[0] });
                // Because it is a .call, we get the return value
            })
            .then(saved => {
                // --> That's where it is weird!!
                // We get the unchanged saved value
                assert.equal(saved.valueOf(), 2, "should still get 2 because it is the unchanged saved value");
                return caller.getNumberIfEvenBad({ from: accounts[0] });
                // Because it is a direct call, we get the txn
            })
            .then(web3.eth.getTransactionReceiptMined)
            .then(receipt => caller.saved())
            .then(saved => {
                // But when checking after a transaction, the proper value was saved...
                assert.equal(saved, 0, "should have been updated to 0 too");
            });

    });

});
