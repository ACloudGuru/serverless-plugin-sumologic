const mockWaitForStack = jest.fn();

jest.mock('./waitForStack', () => ({
  waitForStack: mockWaitForStack,
}));

const { createStack } = require('./createStack');

const request = jest.fn();

const params = {
  StackName: 'stack-name',
};

describe('#createStack', () => {
  it('should create the stack', async () => {
    mockWaitForStack.mockResolvedValue('response');
    request.mockResolvedValue();
    const stack = await createStack({
      request,
      params,
      region: 'east',
    });

    expect(stack).toEqual('response');
    expect(request).toHaveBeenCalledWith(
      'CloudFormation',
      'createStack',
      { ...params, OnFailure: 'DELETE' },
      { region: 'east' }
    );
    expect(mockWaitForStack).toHaveBeenCalledWith({
      request,
      name: 'stack-name',
      region: 'east',
    });
  });
});
