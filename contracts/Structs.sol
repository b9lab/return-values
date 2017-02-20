pragma solidity ^0.4.5;

contract Structs {
    struct Obj {
        address who;
        uint integer;
    }

    Obj[] objs;

    function setAll(address[] whos, uint[] integers) {
        if (whos.length != integers.length) {
            throw;
        }
        uint length = whos.length;
        objs.length = length;
        for (uint i = 0; i < length; i++) {
            objs[i] = Obj({
                who: whos[i],
                integer: integers[i]
            });
        }
    }

    function getAll()
        constant
        returns (address[] whos, uint[] integers) {
        uint length = objs.length;
        whos = new address[](length);
        integers = new uint[](length);
        if (length > 0) {
            Obj obj = objs[0];
            for (uint i = 0; i < length; i++) {
                obj = objs[i];
                whos[i] = obj.who;
                integers[i] = obj.integer;
            }
        }
    }
}