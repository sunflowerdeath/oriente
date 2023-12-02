import LayersStory from './layers.md'
import PopupStory from './popup.md'
import TooltipStory from './tooltip.md'
import MenuStory from './menu.md'
import ModalStory from './modal.md'
import ToastsStory from './toasts.md'
import FlexStory from './flex.md'

import FormsStory from './forms.md'

const componentsSection = {
    name: 'Components',
    stories: {
        layers: {
            name: 'Layers',
            markdown: LayersStory
        },
        popup: {
            name: 'Popup',
            markdown: PopupStory
        },
        tooltip: {
            name: 'Tooltip',
            markdown: TooltipStory
        },
        menu: {
            name: 'Menu',
            markdown: MenuStory
        },
        modal: {
            name: 'Modal',
            markdown: ModalStory
        },
        toasts: {
            name: 'Toasts',
            markdown: ToastsStory
        },
        flex: {
            name: 'Flex',
            markdown: FlexStory
        },
        forms: {
            name: 'Forms',
            markdown: FormsStory
        }
    }
}

export default componentsSection
