const mergeRefs = (...refs) => (value) => {
    refs.forEach((ref) => {
        if (ref == null) return
        if (typeof ref === 'function') {
            ref(value)
            return
        }
        try {
            ref.current = value
        } catch (e) {}
    })
}

export default mergeRefs
