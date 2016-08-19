contract Tool {
	uint public number;

	function setNumber(uint _number) {
		number = _number;
	}

    function numberIsEven() returns (bool) {
        return (number % 2) == 0;
    }
}