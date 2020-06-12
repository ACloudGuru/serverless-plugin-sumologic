const mockWaitForStack = jest.fn();
jest.mock('./waitForStack', () => ({
  waitForStack: mockWaitForStack,
}));

const { updateStack } = require('./updateStack');

const request = jest.fn();

const params = {
  StackName: 'stack-name',
};

describe('#updateStack', () => {
  it('should update the stack', async () => {
    mockWaitForStack.mockResolvedValue('response');
    request.mockResolvedValue();
    const stack = await updateStack({
      request,
      params,
      region: 'east',
    });

    expect(stack).toEqual('response');
    expect(request).toHaveBeenCalledWith(
      'CloudFormation',
      'updateStack',
      params,
      { region: 'east' }
    );
    expect(mockWaitForStack).toHaveBeenCalledWith({
      request,
      name: 'stack-name',
      region: 'east',
    });
  });

  it('should return null if stack does not have updates', async () => {
    request.mockRejectedValue(new Error('No updates'));
    const stack = await updateStack({
      request,
      params,
      region: 'east',
    });

    expect(stack).toBeNull();
  });

  it('should escalate error', async () => {
    request.mockRejectedValue(new Error('something went wrong'));
    const stack = updateStack({
      request,
      name: 'stack-name',
      region: 'east',
    });

    await expect(() => stack).rejects.toThrowError('something went wrong');
  });
});
