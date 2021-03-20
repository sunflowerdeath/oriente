import LayersStory from './layers.md'
import PopupStory from './popup.md'
import TooltipStory from './tooltip.md'
import MenuStory from './menu.md'
import ModalStory from './modal.md'

const coreSection = {
    name: 'Core',
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
        }
    }
}

export default coreSection
