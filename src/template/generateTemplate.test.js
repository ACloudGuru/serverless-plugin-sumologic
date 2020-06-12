const mockGetResources = jest.fn();
const mockGetOutputs = jest.fn();
jest.mock('./getResources', () => ({ getResources: mockGetResources }));
jest.mock('./getOutputs', () => ({ getOutputs: mockGetOutputs }));

const { generateTemplate } = require('./generateTemplate');
const { Mappings } = require('./mappings');
const { Parameters } = require('./parameters');

describe('#getConfig', () => {
  it('should generate cloudformation template', () => {
    mockGetResources.mockReturnValue('resources');
    mockGetOutputs.mockReturnValue('outputs');
    const config = { stage: 'test', name: 'my-stack' };
    const template = generateTemplate({ config });

    expect(template).toEqual({
      AWSTemplateFormatVersion: '2010-09-09',
      Description:
        'Cloudformation stack for streaming Cloudwatch logs to Sumologic',
      Parameters,
      Mappings,
      Resources: 'resources',
      Outputs: 'outputs',
    });
    expect(mockGetOutputs).toHaveBeenCalledWith({ prefix: 'MyStack' });
    expect(mockGetResources).toHaveBeenCalledWith({
      stage: 'test',
      name: 'my-stack',
      prefix: 'MyStack',
    });
  });
});
