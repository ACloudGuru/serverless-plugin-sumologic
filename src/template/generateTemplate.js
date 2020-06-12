const { Mappings } = require('./mappings');
const { Outputs } = require('./outputs');
const { Parameters } = require('./parameters');
const { getResources } = require('./getResources');

const generateTemplate = ({ config }) => ({
  AWSTemplateFormatVersion: '2010-09-09',
  Description:
    'Cloudformation stack for streaming Cloudwatch logs to Sumologic',
  Parameters,
  Mappings,
  Resources: getResources({ ...config }),
  Outputs,
});

module.exports = { generateTemplate };
