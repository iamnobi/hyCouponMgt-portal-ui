// module.exports = { presets: ['@vue/app'] };

// useBuiltIns default value is set as usage value is set as usage, if need to support ie11 should be set us entry
// plugin babel-plugin-transform-remove-console // https://www.npmjs.com/package/babel-plugin-transform-remove-console
// , { exclude: ['error', 'warn'] }
module.exports = {
  presets: [['@vue/app', { useBuiltIns: 'entry' }], ['@babel/preset-env']],
  plugins: ['@babel/plugin-proposal-class-properties'],
  env: {
    production: {
      plugins: [['transform-remove-console']]
    }
  }
};
