const { waitForStack } = require('./waitForStack');

const describeStack = jest.fn();

describe('#waitForStack', () => {
  it('should return false if stack does not exist', async () => {
    describeStack.mockResolvedValue();
    const wait = waitForStack({ describeStack, timeout: 0 });
    const response = await wait({ name: 'stack-name', region: 'east' });

    expect(response).toEqual(false);
  });

  it('should throw error on failure', async () => {
    describeStack.mockResolvedValue({ StackStatus: 'CREATE_FAILED' });
    const wait = waitForStack({ describeStack, timeout: 0 });
    const func = () => wait({ name: 'stack-name', region: 'east' });

    await expect(func).rejects.toThrow('Stack status check failed');
  });

  it('should wait for stack progress to complete', async () => {
    describeStack
      .mockResolvedValueOnce({ StackStatus: 'CREATE_IN_PROGRESS' })
      .mockResolvedValueOnce({ StackStatus: 'CREATE_IN_PROGRESS' })
      .mockResolvedValueOnce({ StackStatus: 'CREATE_COMPLETE' });

    const wait = waitForStack({ describeStack, timeout: 0 });
    const response = await wait({ name: 'stack-name', region: 'east' });

    expect(response).toBeTruthy();
    expect(describeStack).toHaveBeenCalledWith({
      name: 'stack-name',
      region: 'east',
    });
    expect(describeStack).toHaveBeenCalledTimes(3);
  });

  it('should handle unknown errors', async () => {
    describeStack.mockResolvedValueOnce({
      StackStatus: 'UNKNOWN_ERROR',
    });

    const wait = waitForStack({ describeStack, timeout: 0 });
    const func = () => wait({ name: 'stack-name', region: 'east' });

    await expect(func).rejects.toThrow(
      'Unknown error with the stack. Check Cloudfromation console for details.'
    );
  });
});
