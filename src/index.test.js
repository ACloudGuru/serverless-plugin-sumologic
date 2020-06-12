const mockGenerateTemplate = jest.fn();
jest.mock('./template/generateTemplate', () => ({
  generateTemplate: mockGenerateTemplate,
}));

const Plugin = require('./index');

const request = jest.fn();

const PluginFactory = (config, env) => {
  const stage = env || 'dev';

  const serverless = {
    cli: {
      log: jest.fn(),
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
    getProvider: () => ({ request }),
  };

  return new Plugin(serverless, stage);
};

describe('#SumologicPlugin', () => {
  it('should have the correct hook defined', () => {
    const plugin = PluginFactory({
      name: 'stack-name',
      endpointUrl: 'endpoint-url',
    });

    expect(Object.keys(plugin.hooks)).toEqual(['before:deploy:deploy']);
  });

  describe('#beforeDeploy', () => {
    let plugin;

    beforeEach(() => {
      request.mockResolvedValue('');

      plugin = PluginFactory({
        name: 'stack-name',
        endpointUrl: 'endpoint-url',
      });
    });

    it('should validate plugin configuration', async () => {
      const spy = jest.spyOn(plugin, 'validate');
      await plugin.beforeDeploy();
      expect(spy).toHaveBeenCalled();
    });

    it('should generate template', async () => {
      await plugin.beforeDeploy();
      expect(mockGenerateTemplate).toHaveBeenCalledWith({
        config: {
          endpointUrl: 'endpoint-url',
          includeLogGroupInfo: false,
          name: 'sumologic-logs-stack-name',
          region: 'east',
          stage: 'test',
        },
      });
    });

    it('should deploy sumologic stack', async () => {
      mockGenerateTemplate.mockReturnValue('template');
      const spy = jest.spyOn(plugin.cloudformation, 'deploy');
      await plugin.beforeDeploy();
      expect(spy).toHaveBeenCalledWith({
        config: {
          endpointUrl: 'endpoint-url',
          includeLogGroupInfo: false,
          name: 'sumologic-logs-stack-name',
          region: 'east',
          stage: 'test',
        },
        template: 'template',
      });
    });

    it('should handle error', () => {
      const spy = jest.spyOn(plugin, 'validate');
      spy.mockRejectedValue(new Error('cannot generate template'));
      return plugin
        .beforeDeploy()
        .then(() => expect(false).toBeTruthy())
        .catch(err => expect(err).toEqual('cannot generate template'));
    });
  });

  describe('#logger', () => {
    it('should log with the correct prefix', () => {
      const plugin = PluginFactory({
        name: 'stack-name',
        endpointUrl: 'endpoint-url',
      });

      plugin.logger.log('hello');
      expect(plugin.serverless.cli.log).toHaveBeenCalledWith(
        'Sumologic: hello'
      );
    });
  });
});
