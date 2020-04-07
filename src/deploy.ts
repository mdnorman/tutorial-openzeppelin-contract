import { setupLoader } from '@openzeppelin/contract-loader/lib';
import { Box } from '../types/contracts/Box';

const {ZWeb3, Contracts, SimpleProject} = require('@openzeppelin/upgrades');

async function main() {
  // Initialize a web3 provider
  ZWeb3.initialize('http://localhost:8545');

  // Load the contract
  const boxContract = Contracts.getFromLocal('Box');

  // Instantiate a project
  const deployAccount = await ZWeb3.defaultAccount();

  console.log(`Account: ${deployAccount}`);

  const myProject = new SimpleProject('tutorial-openzeppelin-contract', {from: deployAccount});

  const accounts = await ZWeb3.web3.eth.getAccounts();
  const ownerAccount = accounts[1];

  // Create a proxy for the contract
  const boxInfo = {name: 'My Box'};

  // const boxProxy = await myProject.createProxy(boxContract, {initMethod: 'initializeBox', initArgs: [boxInfo]});
  // const boxProxy = await myProject.createProxy(boxContract, {initMethod: 'initialize', initArgs: [ownerAccount]});
  const boxProxy = await myProject.createProxy(boxContract);

  const boxAddress = boxProxy.address;
  console.log(`Proxy: ${boxAddress}`);

  const loader = setupLoader({provider: ZWeb3.web3}).web3;

  const box: Box = loader.fromArtifact('Box', boxAddress);

  await box.methods.initializeBox(boxInfo).send({from: ownerAccount});
  console.log('Initialized');

  const owner = await box.methods.owner().call({from: accounts[2]});
  console.log(`Owner: ${owner}`);

  const boxName = await box.methods.name().call({from: accounts[2]});
  console.log(`Box name: ${boxName}`);

  // console.log(`Project: ${JSON.stringify(myProject, null, 2)}`);

  // Make a change on the contract, and compile it
  // const MyContractUpgraded = Contracts.getFromLocal('MyContractUpgraded');
  // myProject.upgradeProxy(proxy, MyContractUpgraded);
}

main();
