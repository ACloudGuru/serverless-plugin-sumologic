const { deployStack } = require('./deployStack');
const { createStack } = require('./createStack');
const { describeStack } = require('./describeStack');
const { updateStack } = require('./updateStack');
const { waitForStack } = require('./waitForStack');

const Cloudformation = ({ provider, logger }) => {
  const describe = describeStack({ provider });
  const wait = waitForStack({ describeStack: describe });
  const create = createStack({ provider, waitForStack: wait });
  const update = updateStack({ logger, provider, waitForStack: wait });
  const deploy = deployStack({
    logger,
    describeStack: describe,
    createStack: create,
    updateStack: update,
  });

  return {
    deploy,
    describe,
    wait,
    create,
    update,
  };
};

module.exports = { Cloudformation };
