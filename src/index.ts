import Web3 = require('web3');
import {setupLoader} from '@openzeppelin/contract-loader/lib';
import {Box} from '../types/contracts/Box';

const main = async () => {
  const web3 = new Web3('http://localhost:8545');

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const loader = setupLoader({provider: web3}).web3;

  const address = '0xA57B8a5584442B467b4689F1144D269d096A3daF';
  const box: Box = loader.fromArtifact('Box', address);

  console.log('Owner:', await box.methods.owner().call());
  console.log('Is Owner 0?', await box.methods.isOwner().call({from: accounts[0]}));
  console.log('Is Owner 1?', await box.methods.isOwner().call({from: accounts[1]}));

  const oldValue = await box.methods.retrieve().call();
  console.log('Old value is:', oldValue);

  const newValue = Number(oldValue) + 1;

  console.log('Storing:', newValue);
  await box.methods.store(newValue).send({from: accounts[1], gas: 50000, gasPrice: 1e6});

  const value = await box.methods.retrieve().call();
  console.log('New value is:', value);
};

main();
