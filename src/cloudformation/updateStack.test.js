const { updateStack } = require('./updateStack');

const waitForStack = jest.fn();

const request = jest.fn();
const provider = { request };
const logger = { log: jest.fn() };

const params = {
  StackName: 'stack-name',
};

describe('#updateStack', () => {
  it('should update the stack', async () => {
    waitForStack.mockResolvedValue('response');
    request.mockResolvedValue();

    const update = updateStack({ logger, provider, waitForStack });

    const stack = await update({
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
    expect(waitForStack).toHaveBeenCalledWith({
      name: 'stack-name',
      region: 'east',
    });
  });

  it('should return null if stack does not have updates', async () => {
    request.mockRejectedValue(new Error('No updates'));

    const update = updateStack({ logger, provider, waitForStack });
    const stack = await update({
      params,
      region: 'east',
    });

    expect(stack).toBeNull();
    expect(logger.log).toHaveBeenCalledWith('Stack is up to date.');
  });

  it('should escalate error', async () => {
    request.mockRejectedValue(new Error('something went wrong'));

    const update = updateStack({ logger, provider, waitForStack });
    const stack = update({
      name: 'stack-name',
      region: 'east',
    });

    await expect(() => stack).rejects.toThrowError('something went wrong');
  });
});
