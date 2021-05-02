import ReactDOM from 'react-dom'
import React from 'react'
import MiniBook from 'minibook'
import { dark } from 'minibook/lib/themes'

import { OrienteProvider } from 'oriente'

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
    <OrienteProvider>
        <MiniBook
            title={
                <div style={{ color: '#f06292' }}>
                    <span style={{ fontWeight: 'normal' }}>☀</span> Oriente
                </div>
            }
            items={sections}
            theme={dark}
        />
    </OrienteProvider>,
    document.querySelector('#root')
)
