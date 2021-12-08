import React, { useState, useEffect } from "react";
import ButtonContract from "./contracts/Button.json";
import getWeb3 from "./getWeb3";
import Form1 from "./images/form1.png";
import Form2 from "./images/form2.png";
import Form3 from "./images/form3.png";
import Form4 from "./images/form4.png";
import "./App.css";

function App() {
  const [monster, setMonster] = useState(null);
  const [level, setLevel] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  function handleLevelUp1() {
    setTimeout(() => {
      contract.methods.levelUp(monster).send({ from: accounts[0], gas: 100000 }).on("receipt", function(receipt) {
        console.log(receipt);
        retrieveMonsterStats();
      })
      .on("error", function(error) {
        console.log(error);
      })
    }, 2000)
  }

  function handleLevelUp2() {
    setTimeout(() => {
      contract.methods.levelUp(monster).send({ from: accounts[0], gas: 100000 }).on("receipt", function(receipt) {
        console.log(receipt);
      })
      .on("error", function(error) {
        console.log(error);
      })
      contract.methods.levelUp(monster).send({ from: accounts[0], gas: 100000 }).on("receipt", function(receipt) {
        console.log(receipt);
        retrieveMonsterStats();
      })
      .on("error", function(error) {
        console.log(error);
      })
    }, 5000)
  }

  async function getMonsterById(id) {
    return contract.methods.monsters(id).call();
  }

  function retrieveMonsterStats() {
    getMonsterById(monster).then(function(monster) {
      setLevel(monster.level);
    })
  }

  // componentDidMount
  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ButtonContract.networks[networkId];
        const contract = new web3.eth.Contract(
          ButtonContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);

      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (web3 && accounts && contract)  {
      function getMonsterIdByOwner(owner) {
        return contract.methods.getOwnersMonsterId(owner).call()
      }

      function retrieveMonster(owner) {
        getMonsterIdByOwner(owner).then(function(monsterId) {
          setMonster(monsterId);
        });
      }

      const load = async () => {
        // create monster, if none owned yet
        contract.methods.getOwnerHasMonster(accounts[0]).call().then(function(hasMonster) {
          if (!hasMonster) {
            contract.methods.createMonster("Harry").send({ from: accounts[0] }).on("receipt", function(receipt) {
              // transaction accepted
              console.log("new monster created");
              console.log(receipt);
              retrieveMonster(accounts[0]);
            })
            .on("error", function(error) {
              console.log(error);
              // error creating monster
            })
          }
          else {
            console.log("monster retrieved from contract")
            retrieveMonster(accounts[0]);
          }
        });
      }
      load();
    }
  }, [web3, accounts, contract]);

  useEffect(() => {
    if (monster && contract) {    
      retrieveMonsterStats();
    }
    // eslint-disable-next-line
  }, [monster, contract]);

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  
  return (
    <div className="App-header">
      <h1>Degen App</h1>
      <div className="monsterBox">
        <MonsterImage level={level}/>
      </div>  
        <button className="button" onClick={handleLevelUp1}>Level up (1)</button> 
        <button className="button" onClick={handleLevelUp2}>Level up (2)</button> 
      <h2>Level: {level}</h2>
    </div>
  );
}

function MonsterImage(props) {
  const [image, setImage] = useState("");
  const level = props.level;
  
  useEffect(() => {
    if (level <= 5) {
      setImage(Form1);
    }
    else if (level > 5 && level <= 10) {
      setImage(Form2);
    }
    else if (level > 10 && level <= 15) {
      setImage(Form3);
    }
    else if (level > 15) {
      setImage(Form4);
    }
  }, [level]);

  if (level) {
    return (
      <img src={image} alt="monster" />
    )
  }
  else {
    return null;
  };
  
}

export default App;
