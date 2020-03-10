import {accounts, contract} from '@openzeppelin/test-environment';
import {BN, constants, expectEvent, expectRevert} from '@openzeppelin/test-helpers';

const BoxContract = contract.fromArtifact('Box');
const [other1, owner, other2] = accounts;

describe('initialize', () => {
  it(`should set the owner`, async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    expect<string>(await box.owner()).toEqual(owner);
  });

  it(`should not be allowed to be run twice`, async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await expectRevert(box.initialize(owner), 'Contract instance has already been initialized');

    // owner should still be the same
    expect<string>(await box.owner()).toEqual(owner);
  });
});

describe('owner', () => {
  it(`should return the owner when initialized`, async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    expect<string>(await box.owner()).toEqual(owner);
  });

  it(`should return null address when not initialized`, async () => {
    const box = await BoxContract.new();

    expect<string>(await box.owner()).toEqual(constants.ZERO_ADDRESS);
  });
});

describe('isOwner', () => {
  it('should return true when the owner', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    expect<boolean>(await box.isOwner({from: owner})).toBe(true);
  });

  it('should return false when not the owner', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    expect<boolean>(await box.isOwner({from: other1})).toBe(false);
    expect<boolean>(await box.isOwner({from: other2})).toBe(false);
    expect<boolean>(await box.isOwner({from: constants.ZERO_ADDRESS})).toBe(false);
    expect<boolean>(await box.isOwner()).toBe(false);
  });
});

describe('retrieve', () => {
  it('should return 0 when not set', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    const retrieved = await box.retrieve();

    expect<string>(retrieved.toString()).toEqual('0');
  });

  it('should return the value after set', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await box.store(12345, {from: owner});

    const retrieved = await box.retrieve();

    expect<string>(retrieved.toString()).toEqual('12345');
  });
});

describe('store', () => {
  it('should store the value when called by owner', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await box.store(12345, {from: owner});

    const retrieved = await box.retrieve();

    expect<string>(retrieved.toString()).toEqual('12345');
  });

  it('should fail to store the value when called by someone other than the owner', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await expectRevert(box.store(12345, {from: other1}), 'Ownable: caller is not the owner');
    await expectRevert(box.store(12345, {from: other2}), 'Ownable: caller is not the owner');
    await expectRevert(box.store(12345), 'Ownable: caller is not the owner');

    const retrieved = await box.retrieve();

    expect<string>(retrieved.toString()).toEqual('0');
  });

  it('should emit ValueChanged event', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    const receipt = await box.store(12345, {from: owner});

    const bigValue = new BN('12345');
    expectEvent(receipt, 'ValueChanged', {newValue: bigValue});
  });
});

describe('increment', () => {
  it('should increment the value when called by owner', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await box.store(12345, {from: owner});

    await box.increment({from: owner});

    const retrieved = await box.retrieve();

    expect<string>(retrieved.toString()).toEqual('12346');
  });

  it('should fail to increment the value when called by someone other than the owner', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await expectRevert(box.increment({from: other1}), 'Ownable: caller is not the owner');
    await expectRevert(box.increment({from: other2}), 'Ownable: caller is not the owner');
    await expectRevert(box.increment(), 'Ownable: caller is not the owner');

    const retrieved = await box.retrieve();

    expect<string>(retrieved.toString()).toEqual('0');
  });

  it('should emit ValueChanged event', async () => {
    const box = await BoxContract.new();
    await box.initialize(owner);

    await box.store(12345, {from: owner});

    const receipt = await box.increment({from: owner});

    const bigValue = new BN('12346');
    expectEvent(receipt, 'ValueChanged', {newValue: bigValue});
  });
});
