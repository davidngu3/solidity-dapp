pragma solidity >=0.4.21 <0.7.0;

contract Button {
    Monster[] monsters; // index is monsterid
    mapping (address => uint) ownerToMonsterId; // owner can only own 1 monster
    mapping (uint => address) monsterIdToOwner; // monster can only be owned by 1 owner

    function createMonster(string memory _name) public {
        Monster memory newMonster = Monster(_name, 0);
        monsters.push(newMonster);
        ownerToMonsterId[msg.sender] = monsters.length - 1;
        monsterIdToOwner[monsters.length - 1] = msg.sender;
    }

    struct Monster {
        string name;
        uint level;
    }
}