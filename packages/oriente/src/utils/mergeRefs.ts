import React from 'react'

const mergeRefs =
    <T>(...refs: (React.Ref<T> | React.LegacyRef<T> | null | undefined)[]) =>
    (value: T) => {
        refs.forEach((ref) => {
            if (ref == null) return
            if (typeof ref === 'function') {
                ref(value)
                return
            }
            try {
                ;(ref as React.MutableRefObject<T>).current = value
            } catch (e) {}
        })
    }

export default mergeRefs
