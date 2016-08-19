module.exports = function(deployer) {
  deployer.deploy(Tool)
  	.then(function() {
  		return deployer.deploy(Caller, Tool.address);
  	});
  
};
