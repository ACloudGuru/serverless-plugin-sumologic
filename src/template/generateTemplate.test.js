const mockGetResources = jest.fn();
jest.mock('./getResources', () => ({
  getResources: mockGetResources,
}));

const { generateTemplate } = require('./generateTemplate');
const { Mappings } = require('./mappings');
const { Outputs } = require('./outputs');
const { Parameters } = require('./parameters');

describe('#getConfig', () => {
  it('should generate cloudformation template', () => {
    mockGetResources.mockReturnValue('resources');
    const config = { stage: 'test' };
    const template = generateTemplate({ config });

    expect(template).toEqual({
      AWSTemplateFormatVersion: '2010-09-09',
      Description:
        'Cloudformation stack for streaming Cloudwatch logs to Sumologic',
      Parameters,
      Mappings,
      Resources: 'resources',
      Outputs,
    });
    expect(mockGetResources).toHaveBeenCalledWith({ stage: 'test' });
  });
});
