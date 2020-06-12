const toCamelCase = str =>
  str
    .split('-')
    .reduce(
      (a, b) =>
        a.charAt(0).toUpperCase() +
        a.slice(1) +
        b.charAt(0).toUpperCase() +
        b.slice(1)
    );

module.exports = { toCamelCase };
