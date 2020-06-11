const { waitForStack } = require('./waitForStack');

const updateStack = ({ provider, params, region }) =>
  provider
    .request('CloudFormation', 'updateStack', params, {
      region,
    })
    .then(() => waitForStack({ provider, name: params.StackName, region }))
    .catch(err => {
      if (err.message && err.message.match(/^No updates/)) {
        return null;
      }

      throw err;
    });

module.exports = { updateStack };
