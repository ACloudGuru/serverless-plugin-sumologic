const { getConfig } = require('./getConfig');

describe('#getConfig', () => {
  it('should get the default config', () => {
    const userConfig = {
      endpointUrl: 'http://sumologic-endpoint',
      name: 'my-service',
    };
    const options = { stage: 'test', region: 'east' };

    const serverless = {
      service: {
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config).toEqual({
      endpointUrl: userConfig.endpointUrl,
      includeLogGroupInfo: false,
      name: 'sumologic-my-service-test',
      region: 'east',
      stage: 'test',
    });
  });

  it('should override default config with user config', () => {
    const userConfig = {
      endpointUrl: 'http://sumologic-endpoint',
      includeLogGroupInfo: true,
      name: 'my-service',
    };

    const options = { stage: 'test' };

    const serverless = {
      service: {
        provider: { region: 'east' },
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config).toEqual({
      ...userConfig,
      stage: 'test',
      name: 'sumologic-my-service-test',
      region: 'east',
    });
  });

  it('should throw error if stage is undefined', () => {
    const config = () => getConfig({ serverless: {}, options: {} });

    expect(config).toThrow(new Error('Serverless "stage" is missing'));
  });

  it('should throw error if region is undefined', () => {
    const config = () =>
      getConfig({ serverless: {}, options: { stage: 'test' } });

    expect(config).toThrow(new Error('Serverless "region" is missing'));
  });

  it('should set stage from aws provider', () => {
    const userConfig = {
      endpointUrl: 'http://sumologic-endpoint',
      includeLogGroupInfo: true,
    };

    const options = {};

    const serverless = {
      service: {
        provider: {
          region: 'east',
          stage: 'test',
        },
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config.stage).toEqual('test');
  });

  it('should prioritize stage from options', () => {
    const userConfig = {
      endpointUrl: 'http://sumologic-endpoint',
      includeLogGroupInfo: true,
    };

    const options = {};

    const serverless = {
      service: {
        provider: {
          region: 'east',
          stage: 'test',
        },
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config.stage).toEqual('test');
  });
});
