module.exports = {
    presets: [
        [require('@babel/preset-env'), { modules: false }],
        require('@babel/preset-react'),
        [
            require('@babel/preset-typescript').default,
            { isTSX: true, allExtensions: true }
        ]
    ]
}
