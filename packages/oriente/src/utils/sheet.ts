import { times, random, fromPairs } from 'lodash'

const uniqClassName = (c: string) =>
    c + '-' + times(4, () => random(35).toString(36)).join('')

const makeClassNamesMap = (classes: string[]) =>
    fromPairs(classes.map((c) => [c, uniqClassName(c)]))

const createStyleElem = (css: string) => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)
}

interface SheetOptions {
    classNames: string[]
    css: (map: { [key: string]: string }) => string
}

const sheet = ({ classNames, css }: SheetOptions) => {
    const map = makeClassNamesMap(classNames)
    createStyleElem(css(map))
    return map
}

export default sheet
