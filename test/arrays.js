var Arrays = artifacts.require("./test/Arrays.sol");

Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('Arrays', function(accounts) {

    var owner, array1;

    before("should prepare accounts", function() {
        assert.isAbove(accounts.length, 1, "should have at least 1 account");
        owner = accounts[0];
        return Extensions.makeSureAreUnlocked([ owner ]);
    });

    beforeEach("should deploy an Arrays",function() {
        return Arrays.new({ from: owner })
            .then(created => array1 = created);
    });

    var limits = {
        boundBelow: 131,
        works: 132,
        doesnot: 133
    };

    var runs = [
        { count: 1 },
        { count: 2 },
        { count: limits.boundBelow },
        { count: limits.works }
    ];

    runs.forEach(run => {

        it("should be possible to push " + run.count + " and get", function() {
            var numbers = randomUintArray(run.count);
            return array1.setAll(numbers, { from: owner, gas: 3000000 })
                .then(txObject => {
                    assert.isBelow(txObject.receipt.gasUsed, 3000000, "should have gone through");
                    return array1.getAll();
                })
                .then(all => {
                    stringifyUintArray(all);
                    stringifyUintArray(numbers);
                    assert.strictEqual(all.length, run.count, "should be exactly " + run.count + " elements");
                    assert.deepEqual(all, numbers, "should be the same values");
                });
        });

    });

    it("should not be possible to push " + limits.doesnot + " and get", function() {
        var numbers = randomUintArray(limits.doesnot);
        return Extensions.expectedExceptionPromise(
            () => array1.setAll(numbers, { from: owner, gas: 3000000 }),
            3000000);
    })

});

function randomUintArray(desiredLength) {
    var maxNumber = web3.toBigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    var created = [];
    while (created.length < desiredLength) {
        created.push(maxNumber.times("" + Math.random()).floor());
    }
    return created;
}

function stringifyUintArray(integers) {
    var stringed;
    for (var i = 0; i < integers.length; i++) {
        integers[i] = "0x" + pad(integers[i].toString(16), 64);
    }
}

function stringifyAddressArray(integers) {
    var stringed;
    for (var i = 0; i < integers.length; i++) {
        integers[i] = "0x" + pad(integers[i].toString(16), 40);
    }
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}