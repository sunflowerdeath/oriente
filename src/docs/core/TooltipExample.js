import React, { useState } from 'react'

import Tooltip from '../../core/Tooltip'

const TooltipExample = ({ children = 'target', ...restProps }) => {
    let [active, setActive] = useState(false)
    let style = {
        padding: '8px 12px',
        background: '#8e44ad',
        willChange: 'transform',
        color: 'white'
    }
    return (
        <Tooltip tooltip="Tooltip!" style={style} {...restProps}>
            <div
                style={{
                    width: 150,
                    height: 40,
                    background: '#444',
                    padding: 8,
                    boxSizing: 'border-box',
                    marginRight: 8,
                    display: 'inline-block'
                }}
                onClick={() => setActive((val) => !val)}
            >
                {children}
            </div>
        </Tooltip>
    )
}

const ControlledTooltipExample = () => {
    let [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <TooltipExample isOpen={isOpen} />
            <label>
                <input
                    type="checkbox"
                    value={isOpen}
                    onChange={() => setIsOpen((v) => !v)}
                />{' '}
                isOpen
            </label>
        </div>
    )
}

export default TooltipExample
export { ControlledTooltipExample }
