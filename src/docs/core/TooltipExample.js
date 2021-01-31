import React, { useState } from 'react'

import Tooltip from '../../core/Tooltip'

const TooltipExample = () => {
    const [active, setActive] = useState(false)
    let style = {
        padding: '5px 10px',
        background: 'cornflowerblue',
        willChange: 'transform',
        color: 'white',
        borderRadius: 5
    }
    return (
        <Tooltip tooltip="Tooltip!" style={style} key="wtf">
            <div
                style={{ width: 150, height: 40, background: '#444' }}
                onClick={() => setActive((val) => !val)}
            >
                Target
            </div>
        </Tooltip>
    )
}

export default TooltipExample
