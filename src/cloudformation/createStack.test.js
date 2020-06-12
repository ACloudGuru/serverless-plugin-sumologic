const { createStack } = require('./createStack');

const waitForStack = jest.fn();

const request = jest.fn();
const provider = { request };

const params = {
  StackName: 'stack-name',
};

describe('#createStack', () => {
  it('should create the stack', async () => {
    waitForStack.mockResolvedValue('response');
    request.mockResolvedValue();
    const create = createStack({ provider, waitForStack });

    const stack = await create({
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
    expect(waitForStack).toHaveBeenCalledWith({
      name: 'stack-name',
      region: 'east',
    });
  });
});
