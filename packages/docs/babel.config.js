module.exports = {
    presets: [
        require('gnoll/config/babelStage0'),
        [
            require('@babel/preset-typescript').default,
            { isTSX: true, allExtensions: true }
        ]
    ]
}
