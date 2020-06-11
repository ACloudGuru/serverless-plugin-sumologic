const { Mappings } = require('./mappings');
const { Outputs } = require('./outputs');
const { Parameters } = require('./parameters');

const generateTemplate = ({ config }) => {
  const template = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description:
      'Cloudformation stack for streaming Cloudwatch logs to Sumologic',
    Parameters,
    Mappings,
    Resources: {
      SumoCWLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          LogGroupName: 'SumoCWLogGroup',
          RetentionInDays: 7,
        },
      },
    },
    Outputs,
  };

  return template;
};

module.exports = { generateTemplate };
