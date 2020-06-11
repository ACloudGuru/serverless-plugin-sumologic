const { beforeDeploy } = require('./hooks/beforeDeploy');

class ServerlessSumologicPlugin {
  constructor(serverless, options) {
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
