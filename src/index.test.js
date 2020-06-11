const PluginFactory = require('./MockPluginFactory');

describe('#SumologicPlugin', () => {
  it('should have the correct hook defined', () => {
    const config = {
      name: 'stack-name',
      endpointUrl: 'endpoint-url',
    };
    const plugin = PluginFactory(config);

    expect(Object.keys(plugin.hooks)).toEqual(['before:deploy:deploy']);
  });
});
