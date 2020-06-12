const { waitForStack } = require('./waitForStack');

const updateStack = ({ request, params, region }) =>
  request('CloudFormation', 'updateStack', params, { region })
    .then(() => waitForStack({ request, name: params.StackName, region }))
    .catch(err => {
      if (err.message && err.message.match(/^No updates/)) {
        return null;
      }

      throw err;
    });

module.exports = { updateStack };
