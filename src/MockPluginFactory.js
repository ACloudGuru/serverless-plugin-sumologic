const Plugin = require('./index');

const PluginFactory = (config, env) => {
  const stage = env || 'dev';

  const serverless = {
    cli: {
      log: console.log,
    },
    service: {
      custom: { sumologic: config },
      getServiceName: () => this.service,
      provider: {
        name: 'aws',
        stage: 'test',
        region: 'east',
        compiledCloudFormationTemplate: {
          Resources: {},
        },
      },
      service: 'fooservice',
    },
    getProvider: () => {
      return {
        provider: { request: () => Promise.resolve({}) },
        getRegion: () => 'fooregion',
        getStage: () => stage,
      };
    },
  };

  return new Plugin(serverless, stage);
};

module.exports = PluginFactory;
