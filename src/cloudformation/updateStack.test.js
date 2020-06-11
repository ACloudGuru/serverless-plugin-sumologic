const { updateStack } = require('./updateStack');

const request = jest.fn();
const provider = { request };

const params = {
  StackName: 'stack-name',
};

describe('#updateStack', () => {
  it('should update the stack', async () => {
    request.mockResolvedValue('response');
    const stack = await updateStack({
      provider,
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
  });

  it('should return null if stack does not have updates', async () => {
    request.mockRejectedValue(new Error('No updates'));
    const stack = await updateStack({
      provider,
      params,
      region: 'east',
    });

    expect(stack).toBeNull();
  });

  it('should escalate error', async () => {
    request.mockRejectedValue(new Error('something went wrong'));
    const stack = updateStack({
      provider,
      name: 'stack-name',
      region: 'east',
    });

    await expect(() => stack).rejects.toThrowError('something went wrong');
  });
});
