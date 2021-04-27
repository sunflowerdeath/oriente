import LayersStory from './layers.md'
import PopupStory from './popup.md'
import TooltipStory from './tooltip.md'
import MenuStory from './menu.md'
import ModalStory from './modal.md'
import ToastsStory from './toasts.md'
import FlexStory from './flex.md'

const componentsSection = {
    name: 'Components',
    items: {
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
        }
    }
}

export default componentsSection