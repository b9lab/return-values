var Tool = artifacts.require("./Tool.sol");
var Caller = artifacts.require("./Caller.sol");

module.exports = function(deployer) {
	deployer.deploy(Tool)
        .then(function() {
            return deployer.deploy(Caller, Tool.address);
        });
};
