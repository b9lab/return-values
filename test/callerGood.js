var Caller = artifacts.require("./test/Caller.sol");
var Tool = artifacts.require("./test/Tool.sol");

Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('Caller good calls', function(accounts) {

    it("calling good version should return correct values", function() {

        var caller, tool;

        return Promise.all([
                Caller.deployed(),
                Tool.deployed()
            ])
            .then(instances => {
                caller = instances[0];
                tool = instances[1];
                // We can call a public field
                return tool.number();
            })
            .then(number => {
                assert.equal(number, 0, "number should start at 0");
                return tool.setNumber(2, { from: accounts[0] });
            })
            .then(txObject => tool.number())
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
                return caller.getNumberIfEvenGood.call({ from: accounts[0] });
                // Because it is a .call, we get the return value
                // But there is an inner call to tool.numberIsEven()
            })
            .then(saved => {
                assert.equal(saved, 2, "should get the number because it is even");
                return caller.getNumberIfEvenGood({ from: accounts[0] });
                // Because it is a direct call, we get the txn
            })
            .then(txObject => caller.saved())
            .then(saved => {
                assert.equal(saved, 2, "should have been updated to the number too");
                return tool.setNumber(3, { from: accounts[0] });
            })
            .then(txObject => tool.number())
            .then(number => {
                assert.equal(number, 3, "number should now be 3");
                return tool.numberIsEven.call({ from: accounts[0] });
            })
            .then(isEven => {
                assert.isFalse(isEven, "number should be said odd now");
                return caller.getNumberIfEvenGood.call({ from: accounts[0] });
                // Because it is a .call, we get the return value
            })
            .then(saved => {
                assert.equal(saved.valueOf(), 0, "should get 0 because it is odd");
                return caller.getNumberIfEvenGood({ from: accounts[0] });
                // Because it is a direct call, we get the txn
            })
            .then(txObject => caller.saved())
            .then(saved => {
                assert.equal(saved, 0, "should have been updated to 0 too");
            });

    });

});
