import React from 'react';
import renderer from 'react-test-renderer';
import ConnectionStatus from '../../../src/components/ConnectionStatus';

describe('ConnectionStatus', () => {
  let fakeSettings;
  let fakeServerInfo;

  beforeEach(() => {
    fakeSettings = {
      bitcoin: {
        network: 'testnet'
      }
    };

    fakeServerInfo = {
      isConnected: true,
      network: 'testnet',
      blocks: 0
    };
  });

  it('renders Connected correctly', () => {
    const tree = renderer.create(
      <ConnectionStatus settings={fakeSettings} serverInfo={fakeServerInfo} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Not Connected correctly', () => {
    fakeServerInfo = null;

    const tree = renderer.create(
      <ConnectionStatus settings={fakeSettings} serverInfo={fakeServerInfo} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Inconsistent Networks correctly', () => {
    fakeServerInfo.network = 'mainnet';

    const tree = renderer.create(
      <ConnectionStatus settings={fakeSettings} serverInfo={fakeServerInfo} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders Server Not Connected to Node correctly', () => {
    fakeServerInfo.isConnected = false;

    const tree = renderer.create(
      <ConnectionStatus settings={fakeSettings} serverInfo={fakeServerInfo} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
