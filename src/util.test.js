const { toCamelCase } = require('./util');

describe('#util', () => {
  describe('#toCamelCase', () => {
    it('should convert string with dashes to camel case', () => {
      expect(toCamelCase('my-stack-name')).toEqual('MyStackName');
    });
  });
});
