const { describeStack } = require('./describeStack');

const IN_PROGRESS = 'in_progress';
const FAILURE = 'failure';
const SUCCESS = 'success';

const STATUS_CODES = {
  CREATE_COMPLETE: SUCCESS,
  CREATE_IN_PROGRESS: IN_PROGRESS,
  CREATE_FAILED: FAILURE,
  DELETE_COMPLETE: SUCCESS,
  DELETE_FAILED: FAILURE,
  DELETE_IN_PROGRESS: IN_PROGRESS,
  REVIEW_IN_PROGRESS: IN_PROGRESS,
  ROLLBACK_COMPLETE: FAILURE,
  ROLLBACK_FAILED: FAILURE,
  ROLLBACK_IN_PROGRESS: IN_PROGRESS,
  UPDATE_COMPLETE: SUCCESS,
  UPDATE_COMPLETE_CLEANUP_IN_PROGRESS: IN_PROGRESS,
  UPDATE_IN_PROGRESS: IN_PROGRESS,
  UPDATE_ROLLBACK_COMPLETE: FAILURE,
  UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS: IN_PROGRESS,
  UPDATE_ROLLBACK_FAILED: FAILURE,
  UPDATE_ROLLBACK_IN_PROGRESS: IN_PROGRESS,
};

const waitForStack = ({ provider, name, region }) => {
  const checkStatus = async () => {
    const stack = await describeStack({ provider, name, region });

    if (!stack) {
      return false;
    }

    const state = STATUS_CODES[stack.StackStatus];

    if (state === IN_PROGRESS) {
      await new Promise(resolve => setTimeout(resolve, 1000)).then(checkStatus);
      return checkStatus();
    }

    if (STATUS_CODES[stack.StackStatus] === FAILURE) {
      throw new Error('Stack status check failed');
    }

    return true;
  };

  return checkStatus();
};

module.exports = { waitForStack };
