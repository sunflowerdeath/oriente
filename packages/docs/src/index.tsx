import { createRoot } from 'react-dom/client'
import { Minibook, themes } from 'minibook'
// import { dark } from 'minibook/lib/themes'

import { OrienteProvider } from 'oriente'

import componentsSection from './components'
import GettingStartedStory from './getting-started.md'

const isProduction = process.env.NODE_ENV === 'production'

const sections = {
    'getting-started': {
        name: 'Getting Started',
        markdown: GettingStartedStory
    },
    components: componentsSection
}

const root = createRoot(document.getElementById('root')!)

root.render(
    <OrienteProvider>
        <Minibook
            title={
                <div style={{ color: '#f06292' }}>
                    <span style={{ fontWeight: 'normal' }}>☀</span> Oriente
                </div>
            }
            items={sections}
            theme={themes.dark}
            // basename={isProduction ? '/oriente/' : ''}
            basename=""
        />
    </OrienteProvider>
)
