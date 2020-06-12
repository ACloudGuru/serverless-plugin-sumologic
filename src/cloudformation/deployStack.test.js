const { deployStack } = require('./deployStack');

const createStack = jest.fn();
const updateStack = jest.fn();
const describeStack = jest.fn();
const logger = { log: jest.fn() };

const config = {
  name: 'stack-name',
  region: 'east',
  stage: 'test',
  endpointUrl: 'sumo-endpoint-url',
  includeLogGroupInfo: false,
};

describe('#deployStack', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create the stack if it does not exist', async () => {
    describeStack.mockResolvedValue(null);
    createStack.mockResolvedValue('response');

    const deploy = deployStack({
      logger,
      createStack,
      updateStack,
      describeStack,
    });

    const stack = await deploy({
      config,
      template: 'template',
    });

    const params = {
      StackName: 'stack-name',
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      Parameters: [
        { ParameterKey: 'Stage', ParameterValue: 'test' },
        {
          ParameterKey: 'SumoEndPointURL',
          ParameterValue: 'sumo-endpoint-url',
        },
        {
          ParameterKey: 'SumoIncludeLogGroupInfo',
          ParameterValue: 'false',
        },
      ],
      TemplateBody: '"template"',
    };

    expect(stack).toEqual('response');
    expect(updateStack).not.toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledWith('Creating stack stack-name...');
    expect(createStack).toHaveBeenCalledWith({
      params,
      region: 'east',
    });
  });

  it('should update the stack if stack exists', async () => {
    describeStack.mockResolvedValue('stack');
    updateStack.mockResolvedValue('response');

    const deploy = deployStack({
      logger,
      createStack,
      updateStack,
      describeStack,
    });

    const stack = await deploy({
      config,
      template: 'template',
    });

    const params = {
      StackName: 'stack-name',
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      Parameters: [
        { ParameterKey: 'Stage', ParameterValue: 'test' },
        {
          ParameterKey: 'SumoEndPointURL',
          ParameterValue: 'sumo-endpoint-url',
        },
        {
          ParameterKey: 'SumoIncludeLogGroupInfo',
          ParameterValue: 'false',
        },
      ],
      TemplateBody: '"template"',
    };

    expect(stack).toEqual('response');
    expect(logger.log).toHaveBeenCalledWith(
      'Stack stack-name already exists. Updating...'
    );
    expect(updateStack).toHaveBeenCalledWith({
      params,
      region: 'east',
    });
    expect(createStack).not.toHaveBeenCalled();
  });
});
