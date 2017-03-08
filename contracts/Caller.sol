pragma solidity ^0.4.5;

import "./Tool.sol";

contract Caller {
    Tool public tool;
    uint public saved;

    function Caller(address _tool) {
        tool = Tool(_tool);
        saved = 42;
    }
    
    function getNumberIfEvenBad() returns (uint) {
        if (tool.numberIsEven()) {
            saved = tool.number();
        } else {
            saved = 0;
        }
        return saved;
    }
    
    function getNumberIfEvenGood() returns (uint) {
        // We need an intermediate variable otherwise a .call() will return the
        // unchanged saved value.
        uint toSave;
        if (tool.numberIsEven()) {
            toSave = tool.number();
        } else {
            toSave = 0;
        }
        saved = toSave;
        return toSave;
    }
}