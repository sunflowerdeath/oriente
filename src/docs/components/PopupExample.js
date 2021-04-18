import React, { useState, useCallback } from 'react'

import Popup from '../../core/Popup'
import { Layer } from '../../core/layers'

const PopupExample = () => {
    const [active, setActive] = useState(false)
    const popup = useCallback((ref) => (
        <div
            ref={ref}
            style={{
                width: 200,
                height: 200,
                background: 'cornflowerblue',
                willChange: 'transform'
            }}
        >
            Popup
        </div>
    ))
    return (
        <Popup isActive={active} popup={popup}>
            <div
                style={{ width: 150, height: 40, background: '#444' }}
                onClick={() => setActive((val) => !val)}
            >
                Target
            </div>
        </Popup>
    )
}

export default PopupExample
