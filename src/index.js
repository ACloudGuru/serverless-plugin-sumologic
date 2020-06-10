const { beforeDeploy } = require('./hooks/beforeDeploy');

class ServerlessSumologicPlugin {
  constructor(serverless, options) {
    console.log(options.stage);
    console.log(serverless.service.provider.stage);
    this.commands = {
      deploy: {
        commands: {
          sumologic: {
            usage: 'Deploy sumologic stack',
            lifecycleEvents: ['deploy'],
          },
        },
      },
    };

    this.hooks = {
      'before:deploy:deploy': beforeDeploy({ serverless, options }),
    };
  }
}

module.exports = ServerlessSumologicPlugin;
