const PluginFactory = require('./MockPluginFactory');

describe('#SumologicPlugin', () => {
  it('should have the correct hook defined', () => {
    const config = {};
    const plugin = PluginFactory(config);

    expect(Object.keys(plugin.hooks)).toEqual(['package:compileEvents']);
  });
});
