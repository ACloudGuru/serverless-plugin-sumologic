const getOutputs = ({ prefix }) => ({
  [`${prefix}SumoCWLogsLambdaArn`]: {
    Description: 'The ARN of the sumologic cloudwatch logs lambda',
    Value: {
      'Fn::GetAtt': [`${prefix}SumoCWLogsLambda`, 'Arn'],
    },
    Export: {
      Name: `${prefix}SumoCWLogsLambdaArn`,
    },
  },
});

module.exports = { getOutputs };
