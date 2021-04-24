import React, { useState } from 'react'

import { Tooltip, TooltipArrow } from '../../core/Tooltip'

const TooltipExample = ({ children = 'target', tooltip="Tooltip!", ...restProps }) => {
    let [active, setActive] = useState(false)
    let style = {
        padding: '8px 12px',
        background: '#8e44ad',
        willChange: 'transform',
        color: 'white'
    }
    return (
        <Tooltip tooltip={tooltip} style={style} {...restProps}>
            <div
                tabIndex={0}
                style={{
                    cursor: 'default',
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

export { ControlledTooltipExample, TooltipExample }
