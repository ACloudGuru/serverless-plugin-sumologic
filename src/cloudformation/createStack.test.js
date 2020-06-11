const { createStack } = require('./createStack');

const request = jest.fn();
const provider = { request };

const params = {
  StackName: 'stack-name',
};

describe('#createStack', () => {
  it('should create the stack', async () => {
    request.mockResolvedValue('response');
    const stack = await createStack({
      provider,
      params,
      region: 'east',
    });

    expect(stack).toEqual('response');
    expect(request).toHaveBeenCalledWith(
      'CloudFormation',
      'createStack',
      { ...params, onFailure: 'ROLLBACK' },
      { region: 'east' }
    );
  });
});
