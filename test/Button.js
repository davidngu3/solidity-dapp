const Button = artifacts.require("./Button.sol");
const monsterNames = ["Harry", "Mitchell"];

contract("Button", (accounts) => {
    let [alice, bob] = accounts;

    let contractInstance;
    beforeEach(async () => {
        contractInstance = await Button.new();
    });

    it("should be able to create a new monster", async () => {
        const result = await contractInstance.createMonster(monsterNames[0], {from: alice});
        assert.equal(result.receipt.status, true);

        const aliceHasMonster = await contractInstance.getOwnerHasMonster(alice);
        assert.equal(aliceHasMonster, true);

        const alicesMonster = await contractInstance.monsters(0);
        assert.equal(alicesMonster.name, monsterNames[0]);
        assert.equal(alicesMonster.level, 0);
        
        const ownerToMonsterIdMapping = await contractInstance.getOwnersMonsterId(alice);
        assert.equal(ownerToMonsterIdMapping, 0);
    })

    it("should be able to level up a monster", async () => {
        const result = await contractInstance.createMonster(monsterNames[0], {from: alice});
        const id = await contractInstance.getOwnersMonsterId(alice);

        let alicesMonster = await contractInstance.monsters(id);
        assert.equal(alicesMonster.level, 0);

        await contractInstance.levelUp(id);

        alicesMonster = await contractInstance.monsters(id);
        assert.equal(alicesMonster.level, 1);
    })
})