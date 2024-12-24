module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: 'default',
    } : false,
  },
};