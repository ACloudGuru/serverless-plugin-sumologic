const { getConfig } = require('./getConfig');

describe('#getConfig', () => {
  it('should get the default config', () => {
    const userConfig = { endpointUrl: 'http://sumologic-endpoint' };

    const serverless = {
      service: {
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless });

    expect(config).toEqual({
      endpointUrl: userConfig.endpointUrl,
      includeLogGroupInfo: false,
    });
  });

  it('should override default config with user config', () => {
    const userConfig = {
      endpointUrl: 'http://sumologic-endpoint',
      includeLogGroupInfo: true,
    };

    const serverless = {
      service: {
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless });

    expect(config).toEqual(userConfig);
  });
});
