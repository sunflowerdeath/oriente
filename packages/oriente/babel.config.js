module.exports = {
    presets: [
        require('gnoll/config/babelStage0'),
        [
            require('@babel/preset-typescript').default,
            { isTSX: true, allExtensions: true }
        ]
    ],
    plugins: [
        require('@babel/plugin-proposal-class-properties').default,
        require('@babel/plugin-transform-runtime').default,
    ]
}
