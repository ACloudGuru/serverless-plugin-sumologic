const getResources = ({ name, stage, prefix }) => ({
  [`${prefix}SumoCWLogGroup`]: {
    Type: 'AWS::Logs::LogGroup',
    Properties: {
      LogGroupName: `${prefix}SumoCWLogGroup`,
      RetentionInDays: 7,
    },
  },
  [`${prefix}SumoCWLogSubsriptionFilter`]: {
    Type: 'AWS::Logs::SubscriptionFilter',
    Properties: {
      LogGroupName: {
        Ref: `${prefix}SumoCWLogGroup`,
      },
      DestinationArn: {
        'Fn::GetAtt': [`${prefix}SumoCWLogsLambda`, 'Arn'],
      },
      FilterPattern: '',
    },
    DependsOn: [
      `${prefix}SumoCWLogGroup`,
      `${prefix}SumoCWLambdaPermission`,
      `${prefix}SumoCWLogsLambda`,
    ],
  },
  [`${prefix}SumoCWLambdaPermission`]: {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      FunctionName: {
        'Fn::GetAtt': [`${prefix}SumoCWLogsLambda`, 'Arn'],
      },
      Action: 'lambda:InvokeFunction',
      Principal: {
        'Fn::Join': [
          '.',
          [
            'logs',
            {
              Ref: 'AWS::Region',
            },
            'amazonaws.com',
          ],
        ],
      },
      SourceAccount: {
        Ref: 'AWS::AccountId',
      },
    },
  },
  [`${prefix}SumoCWDeadLetterQueue`]: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: `${prefix}SumoCWDeadLetterQueue`,
    },
  },
  [`${prefix}SumoCWLambdaExecutionRole`]: {
    Type: 'AWS::IAM::Role',
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: ['lambda.amazonaws.com'],
            },
            Action: ['sts:AssumeRole'],
          },
        ],
      },
      Path: '/',
      Policies: [
        {
          PolicyName: 'SQSCreateLogsRolePolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'sqs:DeleteMessage',
                  'sqs:GetQueueUrl',
                  'sqs:ListQueues',
                  'sqs:ChangeMessageVisibility',
                  'sqs:SendMessageBatch',
                  'sqs:ReceiveMessage',
                  'sqs:SendMessage',
                  'sqs:GetQueueAttributes',
                  'sqs:ListQueueTags',
                  'sqs:ListDeadLetterSourceQueues',
                  'sqs:DeleteMessageBatch',
                  'sqs:PurgeQueue',
                  'sqs:DeleteQueue',
                  'sqs:CreateQueue',
                  'sqs:ChangeMessageVisibilityBatch',
                  'sqs:SetQueueAttributes',
                ],
                Resource: [
                  {
                    'Fn::GetAtt': [`${prefix}SumoCWDeadLetterQueue`, 'Arn'],
                  },
                ],
              },
            ],
          },
        },
        {
          PolicyName: 'CloudWatchCreateLogsRolePolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                  'logs:DescribeLogStreams',
                ],
                Resource: [
                  {
                    'Fn::Join': [
                      ':',
                      [
                        'arn',
                        'aws',
                        'logs',
                        {
                          Ref: 'AWS::Region',
                        },
                        {
                          Ref: 'AWS::AccountId',
                        },
                        'log-group',
                        '*',
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          PolicyName: 'InvokeLambdaRolePolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['lambda:InvokeFunction'],
                Resource: [
                  {
                    'Fn::Join': [
                      ':',
                      [
                        'arn',
                        'aws',
                        'lambda',
                        {
                          Ref: 'AWS::Region',
                        },
                        {
                          Ref: 'AWS::AccountId',
                        },
                        'function',
                        `${prefix}SumoCWProcessDLQLambda`,
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
  [`${prefix}SumoCWLogsLambda`]: {
    Type: 'AWS::Lambda::Function',
    DependsOn: [
      `${prefix}SumoCWLambdaExecutionRole`,
      `${prefix}SumoCWDeadLetterQueue`,
    ],
    Properties: {
      FunctionName: {
        'Fn::Sub': name,
      },
      Code: {
        S3Bucket: {
          'Fn::FindInMap': [
            'RegionMap',
            {
              Ref: 'AWS::Region',
            },
            'bucketname',
          ],
        },
        S3Key: 'cloudwatchlogs-with-dlq.zip',
      },
      Role: {
        'Fn::GetAtt': [`${prefix}SumoCWLambdaExecutionRole`, 'Arn'],
      },
      Timeout: 300,
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': [`${prefix}SumoCWDeadLetterQueue`, 'Arn'],
        },
      },
      Handler: 'cloudwatchlogs_lambda.handler',
      Runtime: 'nodejs16.x',
      MemorySize: 128,
      Environment: {
        Variables: {
          SUMO_ENDPOINT: {
            Ref: 'SumoEndPointURL',
          },
          LOG_FORMAT: 'VPC-JSON',
          INCLUDE_LOG_INFO: {
            Ref: 'SumoIncludeLogGroupInfo',
          },
        },
      },
    },
  },
  [`${prefix}SumoCWEventsInvokeLambdaPermission`]: {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      FunctionName: {
        Ref: `${prefix}SumoCWProcessDLQLambda`,
      },
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': [`${prefix}SumoCWProcessDLQScheduleRule`, 'Arn'],
      },
    },
  },
  [`${prefix}SumoCWProcessDLQScheduleRule`]: {
    Type: 'AWS::Events::Rule',
    Properties: {
      Description: 'Events rule for Cron',
      ScheduleExpression: 'rate(5 minutes)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [`${prefix}SumoCWProcessDLQLambda`, 'Arn'],
          },
          Id: 'TargetFunctionV1',
        },
      ],
    },
  },
  [`${prefix}SumoCWProcessDLQLambda`]: {
    Type: 'AWS::Lambda::Function',
    DependsOn: [
      `${prefix}SumoCWLambdaExecutionRole`,
      `${prefix}SumoCWDeadLetterQueue`,
    ],
    Properties: {
      FunctionName: {
        'Fn::Sub': `${name}-sumologic-DLQ-${stage}`,
      },
      Code: {
        S3Bucket: {
          'Fn::FindInMap': [
            'RegionMap',
            {
              Ref: 'AWS::Region',
            },
            'bucketname',
          ],
        },
        S3Key: 'cloudwatchlogs-with-dlq.zip',
      },
      Role: {
        'Fn::GetAtt': [`${prefix}SumoCWLambdaExecutionRole`, 'Arn'],
      },
      Timeout: 300,
      Handler: 'DLQProcessor.handler',
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': [`${prefix}SumoCWDeadLetterQueue`, 'Arn'],
        },
      },
      Runtime: 'nodejs16.x',
      MemorySize: 128,
      Environment: {
        Variables: {
          SUMO_ENDPOINT: {
            Ref: 'SumoEndPointURL',
          },
          TASK_QUEUE_URL: {
            'Fn::Join': [
              '',
              [
                'https://sqs.',
                {
                  Ref: 'AWS::Region',
                },
                '.amazonaws.com/',
                {
                  Ref: 'AWS::AccountId',
                },
                '/',
                {
                  'Fn::GetAtt': [`${prefix}SumoCWDeadLetterQueue`, 'QueueName'],
                },
              ],
            ],
          },
          NUM_OF_WORKERS: 4,
          LOG_FORMAT: 'VPC-JSON',
          INCLUDE_LOG_INFO: {
            Ref: 'SumoIncludeLogGroupInfo',
          },
        },
      },
    },
  },
});

module.exports = { getResources };
