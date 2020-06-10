const { getConfig } = require('./getConfig');

describe('#getConfig', () => {
  it('should get the default config', () => {
    const userConfig = { endpointUrl: 'http://sumologic-endpoint' };
    const options = { stage: 'test' };

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
      stage: 'test',
    });
  });

  it('should override default config with user config', () => {
    const userConfig = {
      endpointUrl: 'http://sumologic-endpoint',
      includeLogGroupInfo: true,
    };

    const options = { stage: 'test' };

    const serverless = {
      service: {
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config).toEqual({ ...userConfig, stage: 'test' });
  });

  it('should throw error if stage is undefined', () => {
    const config = () => getConfig({ serverless: {}, options: {} });

    expect(config).toThrow(new Error('Run serverless with --stage flag!'));
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
          stage: 'test',
        },
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config).toEqual({ ...userConfig, stage: 'test' });
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
          stage: 'test',
        },
        custom: {
          sumologic: userConfig,
        },
      },
    };

    const config = getConfig({ serverless, options });

    expect(config).toEqual({ ...userConfig, stage: 'test' });
  });
});
