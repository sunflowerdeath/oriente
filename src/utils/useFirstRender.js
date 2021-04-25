import { useRef } from 'react'

const useFirstRender = () => {
    const isFirstRender = useRef(true)
    useEffect(() => {
        isFirstRender.current = false
    })
    return isFirstRender.current
}

export default useFirstRender
