Extensions = require("../utils/extensions.js");
Extensions.init(web3, assert);

contract('Structs', function(accounts) {

    var owner, struct1;

    before("should prepare accounts", function() {
        assert.isAbove(accounts.length, 1, "should have at least 1 account");
        owner = accounts[0];
        return Extensions.makeSureAreUnlocked([ owner ]);
    });

    beforeEach("should deploy a Structs",function() {
        return Structs.new({ from: owner })
            .then(created => {
                struct1 = created;
            });
    });

    var limits = {
        boundBelow: 66,
        works: 67,
        doesnot: 68
    };

    var runs = [
        { count: 1 },
        { count: 2 },
        { count: limits.boundBelow },
        { count: limits.works }
    ];

    runs.forEach(run => {

        it("should be possible to push " + run.count + " and get", function() {
            var addresses = randomAddressArray(run.count);
            var numbers = randomUintArray(run.count);
            return struct1.setAll(addresses, numbers, { from: owner, gas: 3000000 })
                .then(web3.eth.getTransactionReceiptMined)
                .then(receipt => {
                    assert.isBelow(receipt.gasUsed, 3000000, "should have gone through");
                    return struct1.getAll();
                })
                .then(all => {
                    assert.strictEqual(all[0].length, run.count, "should be exactly " + run.count + " elements");
                    assert.strictEqual(all[1].length, run.count, "should be exactly " + run.count + " elements");
                    stringifyAddressArray(addresses);
                    assert.deepEqual(all[0], addresses, "should be the same addresses");
                    stringifyUintArray(all[1]);
                    stringifyUintArray(numbers);
                    assert.deepEqual(all[1], numbers, "should be the same integers");
                });
        });

    });

    it("should not be possible to push " + limits.doesnot + " and get", function() {
        var addresses = randomAddressArray(limits.doesnot);
        var numbers = randomUintArray(limits.doesnot);
        return Extensions.expectedExceptionPromise(
            () => struct1.setAll(addresses, numbers, { from: owner, gas: 3000000 }),
            3000000);
    })

});

function randomAddressArray(desiredLength) {
    var maxNumber = web3.toBigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    var created = [];
    while (created.length < desiredLength) {
        created.push(maxNumber.times("" + Math.random()).floor());
    }
    return created;
}

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