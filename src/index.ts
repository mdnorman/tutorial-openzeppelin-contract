import Web3 = require('web3');
import {setupLoader} from '@openzeppelin/contract-loader/lib';
import {BoxInstance} from '../types/contracts';

const main = async () => {
  const web3 = new Web3('http://localhost:8545');

  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  const loader = setupLoader({provider: web3}).web3;

  const address = '0xA57B8a5584442B467b4689F1144D269d096A3daF';
  const box: BoxInstance = loader.fromArtifact('Box', address);

  const owner = await box.owner();
  console.log('Owner:', owner);
  console.log('Is Owner 0?', await box.isOwner({from: accounts[0]}));
  console.log('Is Owner 1?', await box.isOwner({from: accounts[1]}));

  const oldValue = await box.retrieve();
  console.log('Old value is:', oldValue);

  const newValue = Number(oldValue) + 10;

  console.log('Storing:', newValue);
  await box.store(newValue, {from: owner, gas: 50000, gasPrice: 1e6});

  const value = await box.retrieve();
  console.log('New value is:', value);

  console.log('Incrementing...');
  await box.increment({from: owner, gas: 50000, gasPrice: 1e6});

  const value2 = await box.retrieve();
  console.log('New value is:', value2);
};

main();
