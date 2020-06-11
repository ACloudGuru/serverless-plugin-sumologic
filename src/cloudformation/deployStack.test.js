const mockCreateStack = jest.fn();
const mockUpdateStack = jest.fn();

jest.mock('./createStack', () => ({
  createStack: mockCreateStack,
}));
jest.mock('./updateStack', () => ({
  updateStack: mockUpdateStack,
}));

const { deployStack } = require('./deployStack');

const request = jest.fn();
const provider = { request };

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
    request.mockResolvedValue({ Stacks: [] });
    mockCreateStack.mockResolvedValue('response');

    const stack = await deployStack({
      provider,
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
    expect(mockUpdateStack).not.toHaveBeenCalled();
    expect(mockCreateStack).toHaveBeenCalledWith({
      provider,
      params,
      region: 'east',
    });
  });

  it('should update the stack if stack exists', async () => {
    request.mockResolvedValue({ Stacks: ['stack'] });
    mockUpdateStack.mockResolvedValue('response');

    const stack = await deployStack({
      provider,
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
    expect(mockUpdateStack).toHaveBeenCalledWith({
      provider,
      params,
      region: 'east',
    });
    expect(mockCreateStack).not.toHaveBeenCalled();
  });
});
