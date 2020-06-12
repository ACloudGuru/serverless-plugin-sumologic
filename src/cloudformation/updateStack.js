const { MESSAGE } = require('../message');

const updateStack = ({ logger, provider, waitForStack }) => ({
  params,
  region,
}) =>
  provider
    .request('CloudFormation', 'updateStack', params, { region })
    .then(() => waitForStack({ name: params.StackName, region }))
    .catch(err => {
      if (err.message && err.message.match(/^No updates/)) {
        logger.log(MESSAGE.STACK_NO_CHANGE);
        return null;
      }

      throw err;
    });

module.exports = { updateStack };
