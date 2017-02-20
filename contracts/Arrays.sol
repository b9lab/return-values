pragma solidity ^0.4.5;

contract Arrays {
    uint[] integers;

    function setAll(uint[] newIntegers) {
        integers = newIntegers;
    }

    function getAll()
        constant
        returns (uint[] all) {
        all = integers;
    }

    function copyAllFrom(address arrays) {
        // Does not compile
        // uint[] memory fetched = Arrays(arrays).getAll();
    }
}