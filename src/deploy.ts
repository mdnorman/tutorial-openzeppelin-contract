import {ZWeb3, Contracts, SimpleProject} from '@openzeppelin/upgrades/lib';
import {setupLoader} from '@openzeppelin/contract-loader/lib';
import {Box} from '../types/contracts/Box';

async function main() {
  // Initialize a web3 provider
  ZWeb3.initialize('http://localhost:8545');

  // Load the contract
  const boxContract = Contracts.getFromLocal('Box');

  const proxyAdminAccount = await ZWeb3.defaultAccount();
  console.log(`Proxy Admin Account: ${proxyAdminAccount}`);

  // Instantiate a project
  const myProject = new SimpleProject('tutorial-openzeppelin-contract', undefined, {from: proxyAdminAccount});

  const accounts = await ZWeb3.web3.eth.getAccounts();
  const ownerAccount = accounts[1];
  console.log(`Owner Account: ${ownerAccount}`);

  // Create a proxy for the contract
  const boxInfo = {name: 'My Box'};

  // This initialize call fails
  // const boxProxy = await myProject.createProxy(boxContract, {
  //   initMethod: 'initializeBox',
  //   // @ts-ignore
  //   initArgs: [boxInfo, ownerAccount],
  // });

  // This initialize call succeeds
  // const boxProxy = await myProject.createProxy(boxContract, {initMethod: 'initialize', initArgs: [ownerAccount]});

  // And initializing after creating proxy also succeeds
  const boxProxy = await myProject.createProxy(boxContract);

  const boxAddress = boxProxy.address;
  console.log(`Proxy: ${boxAddress}`);

  // Load the created contract to initialize and execute methods
  const loader = setupLoader({provider: ZWeb3.web3}).web3;

  const box: Box = loader.fromArtifact('Box', boxAddress);

  await box.methods.initializeBox(boxInfo, ownerAccount).send({from: ownerAccount});
  console.log('Box initialized');

  const owner = await box.methods.owner().call({from: accounts[2]});
  console.log(`Box owner: ${owner}`);

  const boxName = await box.methods.name().call({from: accounts[2]});
  console.log(`Box name: ${boxName}`);

  // console.log(`Project: ${JSON.stringify(myProject, null, 2)}`);

  // Make a change on the contract, and compile it
  // const MyContractUpgraded = Contracts.getFromLocal('MyContractUpgraded');
  // myProject.upgradeProxy(proxy, MyContractUpgraded);
}

main();
