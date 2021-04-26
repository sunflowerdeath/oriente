import ReactDOM from 'react-dom'
import React from 'react'
import MiniBook from 'minibook'
import { dark } from 'minibook/lib/themes'

import { Stack, ToastContainer } from 'oriente'

import componentsSection from './components'
import GettingStartedStory from './getting-started.md'

const sections = {
    'getting-started': {
        name: 'Getting Started',
        markdown: GettingStartedStory
    },
    components: componentsSection
}

ReactDOM.render(
    <Stack>
        <ToastContainer>
            <MiniBook
                title={
                    <span style={{ color: '#f06292' }}>
                        <span style={{ fontWeight: 'normal' }}>☀</span> Oriente
                    </span>
                }
                items={sections}
                theme={dark}
            />
        </ToastContainer>
    </Stack>,
    document.querySelector('#root')
)
