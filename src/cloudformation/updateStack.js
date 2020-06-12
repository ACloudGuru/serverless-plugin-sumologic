const updateStack = ({ provider, waitForStack }) => ({ params, region }) =>
  provider
    .request('CloudFormation', 'updateStack', params, { region })
    .then(() => waitForStack({ name: params.StackName, region }))
    .catch(err => {
      if (err.message && err.message.match(/^No updates/)) {
        return null;
      }

      throw err;
    });

module.exports = { updateStack };
