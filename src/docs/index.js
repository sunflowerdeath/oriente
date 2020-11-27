import ReactDOM from 'react-dom'
import React from 'react'
import MiniBook from 'minibook'
import { dark } from 'minibook/lib/themes'

import { Stack } from '../core/layers'

import coreSection from './core'

const sections = {
    core: coreSection
}

ReactDOM.render(
    <Stack>
        <MiniBook
            title={
                <span style={{ color: '#f06292' }}>
                    <span style={{ fontWeight: 'normal' }}>☀</span> Oriente
                </span>
            }
            sections={sections}
            theme={dark}
        />
    </Stack>,
    document.querySelector('#root')
)
