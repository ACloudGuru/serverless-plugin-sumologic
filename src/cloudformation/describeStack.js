const describeStack = ({ provider }) => ({ name, region }) => {
  return provider
    .request(
      'CloudFormation',
      'describeStacks',
      { StackName: name },
      { region }
    )
    .then(response => response.Stacks && response.Stacks[0])
    .catch(err => {
      if (err.message && err.message.match(/does not exist$/)) {
        return null;
      }

      throw err;
    });
};

module.exports = { describeStack };
