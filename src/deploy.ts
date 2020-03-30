const { ZWeb3, Contracts, SimpleProject } = require('@openzeppelin/upgrades');

async function main() {
  // Initialize a web3 provider
  ZWeb3.initialize("http://localhost:8545");

  // Load the contract
  const MyContract = Contracts.getFromLocal('Box');

  // Instantiate a project
  const myProject = new SimpleProject('tutorial-OpenZeppelin-contract', {
    from: await ZWeb3.defaultAccount()
  });

  // Create a proxy for the contract
  const proxy = await myProject.createProxy(MyContract);

  console.log(`Proxy: ${JSON.stringify(proxy)}`);

  console.log(`Project: ${JSON.stringify(myProject)}`)

  // Make a change on the contract, and compile it
  // const MyContractUpgraded = Contracts.getFromLocal('MyContractUpgraded');
  // myProject.upgradeProxy(proxy, MyContractUpgraded);
}

main();
