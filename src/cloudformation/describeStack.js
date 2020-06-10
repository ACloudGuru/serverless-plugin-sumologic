const describeStack = ({ provider, config }) =>
  provider
    .request('CloudFormation', 'describeStacks', { StackName: config.name }, config.stage, config.region)
    .then(response => {
      return response.Stacks && response.Stacks[0];
    })
    .then(null, err => {
      if (err.message && err.message.match(/does not exist$/)) {
        return null;
      }

      return Promise.reject(err);
    });

module.exports = { describeStack };
