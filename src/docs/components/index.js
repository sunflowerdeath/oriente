import LayersStory from './layers.md'
import PopupStory from './popup.md'
import TooltipStory from './tooltip.md'
import MenuStory from './menu.md'
import ModalStory from './modal.md'
import ToastsStory from './toasts.md'

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
        }
    }
}

export default componentsSection
