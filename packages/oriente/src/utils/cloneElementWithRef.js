import React from 'react'

import mergeRefs from './mergeRefs'

const cloneElementWithRef = (elem, props, ...children) =>
    React.cloneElement(
        elem,
        { ...props, ref: mergeRefs(props.ref, elem.ref) },
        ...children
    )

export default cloneElementWithRef
