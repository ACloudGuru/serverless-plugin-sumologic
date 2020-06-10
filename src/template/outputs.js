const Outputs = {
  SumoCWLogsLambdaArn: {
    Description: 'The ARN of the sumologic cloudwatch logs lambda',
    Value: {
      'Fn::GetAtt': ['SumoCWLogsLambda', 'Arn'],
    },
    Export: {
      Name: 'SumoCWLogsLambdaArn',
    },
  },
};

module.exports = { Outputs };
