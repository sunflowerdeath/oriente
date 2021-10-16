const scrollIntoView = (item: HTMLElement) => {
    const container = item.parentElement!
    const itemRect = item.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scrollTop = container.scrollTop
    const itemPos = itemRect.top - containerRect.top + scrollTop
    if (itemPos < scrollTop) {
        container.scrollTop = itemPos
    } else if (itemPos > scrollTop + containerRect.height - itemRect.height) {
        container.scrollTop = itemPos + itemRect.height - containerRect.height
    }
}

export default scrollIntoView
