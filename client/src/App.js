import React, { Component } from "react";
import ButtonContract from "./contracts/Button.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { level: 0, web3: null, accounts: null, contract: null };
  
  constructor(props) {
    super(props)
    this.handleLevelUp = this.handleLevelUp.bind(this);  
  }

  handleLevelUp() {
    this.setState({ level: this.state.level + 1 });
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ButtonContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ButtonContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      instance.methods.getOwnerHasMonster(accounts[0]).call().then(function(hasMonster) {
        if (!hasMonster) {
          instance.methods.createMonster("Harry").call().then(getMonsterIdByOwner(web3.eth.accounts[0])).then(displayMonster);
        }
        else {
          getMonsterIdByOwner(web3.eth.accounts[0]).then(displayMonster);
        }
      });

      function getMonsterIdByOwner(owner) {
        return instance.methods.getOwnersMonsterId(owner).call()
      }

      function displayMonster(id) {
        getMonsterById(id).then(function(monster) {
          this.setState({ level: monster.level });
        })
      }

      function getMonsterById(id) {
        return instance.methods.monsters(id).call();
      }

      this.setState({ web3: web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App-header">
        <h1>My First Solidity Dapp</h1>
        <button onClick={this.handleLevelUp}>Level up</button>
        <h2>Level: {this.state.level}</h2>
      </div>
    );
  }
}

export default App;
