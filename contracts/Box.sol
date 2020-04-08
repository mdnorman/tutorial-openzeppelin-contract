pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

// Import Ownable from the OpenZeppelin Contracts library
import '@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol';


// Make Box inherit from the Ownable contract
contract Box is Ownable {
  struct BoxInfo {
    string name;
  }

  uint256 private _value;
  BoxInfo private _info;

  event ValueChanged(uint256 newValue);

  function initializeBox(BoxInfo memory info, address owner) public initializer {
    _info = info;

    // solhint-disable-next-line mark-callable-contracts
    Ownable.initialize(owner);
  }

  function name() public view returns (string memory) {
    return _info.name;
  }

  // The onlyOwner modifier restricts who can call the store function
  function store(uint256 newValue) public onlyOwner {
    _value = newValue;
    emit ValueChanged(newValue);
  }

  function increment() public onlyOwner {
    store(_value + 1);
  }

  function retrieve() public view returns (uint256) {
    return _value;
  }
}
