const baseWebpackConfig = require('gnoll/config/webpack')

const path = require('path')
const { entry, ...webpackConfig } = baseWebpackConfig
webpackConfig.devtool = false

module.exports = config => {
	config.set({
		files: [
			'./src/index.test.js'
		],
		preprocessors: {
			'./src/index.test.js': ['webpack']
		},
		frameworks: ['mocha'],
		webpack: webpackConfig
	})
}
