const MESSAGE = {
  CLI_DONE: 'Done.',
  CLI_START: 'Deploying stack...',
  INVALID_CONFIGURATION: 'Invalid serverless configuration!!',
  NO_SUMOLOGIC_CONFIG: 'Configuration not found!!',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provider',
  NO_SUMOLOGIC_NAME: 'Config missing - custom.sumologic.name',
  NO_SUMOLOGIC_ENDPOINT_URL: 'Config missing - custom.sumologic.endpointUrl',
  STACK_UPDATE: 'Stack "%s" already exists. Updating...',
  STACK_CREATE: 'Creating stack "%s"...',
  STACK_NO_CHANGE: 'Stack is up to date.',
};

module.exports = { MESSAGE };
