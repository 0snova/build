module.exports = (api) => {
  const isTest = api.env('test');

  return {
    presets: [
      ['@babel/preset-env', { targets: isTest ? { node: 'current' } : { node: 12 } }],
      '@babel/preset-typescript',
    ],
  };
};
