pragma solidity >=0.4.21 <0.7.0;

contract Button {
    Monster[] public monsters; // index is monsterid
    mapping (address => uint) ownerToMonsterId; // owner can only own 1 monster
    mapping (uint => address) monsterIdToOwner; // monster can only be owned by 1 owner
    mapping (address => bool) ownerHasMonster;

    /*
        Creates a new instance of a monster and records its owner
    */
    function createMonster(string memory _name) public {
        Monster memory newMonster = Monster(_name, 0);
        monsters.push(newMonster);
        ownerToMonsterId[msg.sender] = monsters.length - 1;
        monsterIdToOwner[monsters.length - 1] = msg.sender;
        ownerHasMonster[msg.sender] = true;
    }

    /*
        Monster level up
    */
    function levelUp(uint monsterId) private {
        monsters[monsterId].level++;
    }

    function getOwnerHasMonster(address owner) public view returns (bool) {
        return ownerHasMonster[owner];
    }

    function getOwnersMonsterId(address owner) public view returns (uint) {
        return ownerToMonsterId[owner];
    }

    struct Monster {
        string name;
        uint level;
    }
}