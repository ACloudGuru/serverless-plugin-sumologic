const Plugin = require('./index');

const PluginFactory = (config, env) => {
  const stage = env || 'dev';

  const serverless = {
    cli: {
      log: console.log,
    },
    service: {
      custom: { config },
      getServiceName: () => this.service,
      provider: {
        name: 'aws',
        compiledCloudFormationTemplate: {
          Resources: {},
        },
      },
      service: 'fooservice',
    },
    getProvider: () => {
      return {
        getRegion: () => 'fooregion',
        getStage: () => stage,
      };
    },
  };

  return new Plugin(serverless, stage);
};

module.exports = PluginFactory;
