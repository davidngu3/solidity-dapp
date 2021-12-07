import React, { Component } from "react";
import ButtonContract from "./contracts/Button.json";
import getWeb3 from "./getWeb3";
import Form1 from "./images/form1.png";
import Form2 from "./images/form2.png";
import Form3 from "./images/form3.png";
import Form4 from "./images/form4.png";

import "./App.css";

class App extends Component {
  state = { level: 0, web3: null, accounts: null, contract: null };
  
  constructor(props) {
    super(props)
    this.handleLevelUp = this.handleLevelUp.bind(this);  
    this.renderMonster = this.renderMonster.bind(this);
  }

  handleLevelUp() {
    this.setState({ level: this.state.level + 1 });
  }

  renderMonster() {
    const { level } = this.state;
    if (level <= 5) {
      return (
        <img src={Form1} alt="weak monster" />
      );
    }
    else if (level > 5 && level <= 10) {
      return (
        <img src={Form2} alt="semiweak monster"  />
      );
    }
    else if (level > 10 && level <= 15) {
      return (
        <img src={Form3} alt="medium monster"  />
      );
    }
    else if (level > 15) {
      return (
        <img src={Form4} alt="strong monster"  />
      );
    }
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
        <h1>Degen App</h1>
        <div className="monsterBox">
          {this.renderMonster.call(this)}
        </div>
        <button class="button" onClick={this.handleLevelUp}>Level up</button>
        <h2>Level: {this.state.level}</h2>
      </div>
    );
  }
}

export default App;
