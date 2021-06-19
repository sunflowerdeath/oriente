import { times, random, fromPairs } from 'lodash'

const uniqClassName = (name: string) =>
    name + '-' + times(4, () => random(35).toString(36)).join('')

const makeClassNamesMap = (classes: string[]) =>
    fromPairs(classes.map((name) => [name, uniqClassName(name)]))

const createStyleElem = (css: string) => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)
}

interface StyleSheetOptions {
    classNames: string[]
    css: (map: { [key: string]: string }) => string
}

const stylesheet = ({ classNames, css }: StyleSheetOptions) => {
    const map = makeClassNamesMap(classNames)
    createStyleElem(css(map))
    return map
}

export default stylesheet
