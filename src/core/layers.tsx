import React, {
    useLayoutEffect,
    useMemo,
    useRef,
    useContext,
    createContext,
    useState,
    memo
} from 'react'

const LAYER_TYPES = ['initial', 'popup', 'fixed', 'modal', 'global']

type LayerType = 'initial' | 'popup' | 'fixed' | 'modal' | 'global'

const StackContext = createContext()
const ParentLayerContext = createContext()

const getStyle = (type: LayerType) =>
    type === 'initial'
        ? { position: 'relative', height: '100%' }
        : { position: 'absolute', top: 0, left: 0 }

const LayerView = memo(({ id, children, type }) => (
    <ParentLayerContext.Provider value={id}>
        <div style={getStyle(type)}>{children}</div>
    </ParentLayerContext.Provider>
))

interface LayerProps {
    /** Controls the visibility of the layer. */
    isActive?: boolean

    /**
     * Layer type. It is used to sort layers in the stack.
     *
     * Possible layer types in order from bottom to top:
     * `'initial'`, `'popup'`, `'fixed'`, `'modal'`, `'global'`.
     */
    type?: LayerType
}

const Layer = memo((props: LayerProps) => {
    const parentId = useContext(ParentLayerContext)
    const stack = useContext(StackContext)
    const idRef = useRef(null)
    useLayoutEffect(() => {
        if (idRef.current === null) {
            if (props.isActive) {
                idRef.current = stack.createLayer(parentId, props)
            }
        } else if (props.isActive) {
            stack.updateLayer(idRef.current, props)
        } else {
            stack.removeLayer(idRef.current)
            idRef.current = null
        }
    }, [props])
    useLayoutEffect(() => {
        return () => {
            if (idRef.current !== null) {
                stack.removeLayer(idRef.current)
                idRef.current = null
            }
        }
    }, [])
    return <></>
})

Layer.displayName = 'Layer'

Layer.defaultProps = {
    isActive: true,
    type: 'popup'
}

let id = 0
const getNextId = () => id++

const createLayer = (setLayers, parentId, props) => {
    const newId = getNextId()
    setLayers((layers) => {
        // Skip all layers until the parent layer
        const skippedParents =
            parentId !== undefined
                ? layers.findIndex(({ id }) => id === parentId) + 1
                : 0

        let skipped
        // Skip all layers with index lower than or equal to the index of the new layer
        const index = LAYER_TYPES.indexOf(props.type)
        for (skipped = skippedParents; skipped < layers.length; skipped++) {
            const nextLayer = layers[skipped]
            if (!nextLayer) break
            if (index < LAYER_TYPES.indexOf(nextLayer.props.type)) break
        }

        return [
            ...layers.slice(0, skipped),
            { id: newId, props },
            ...layers.slice(skipped)
        ]
    })
    return newId
}

const updateLayer = (setLayers, id, props) => {
    setLayers((layers) =>
        layers.map((layer) => (id === layer.id ? { ...layer, props } : layer))
    )
}

const removeLayer = (setLayers, id) =>
    setLayers((layers) => layers.filter((layer) => id !== layer.id))

interface StackProps {
    children: React.ReactNode
}

const Stack = ({ children }: StackProps) => {
    const [layers, setLayers] = useState([])
    const context = useMemo(
        () => ({
            createLayer: (...args) => createLayer(setLayers, ...args),
            updateLayer: (...args) => updateLayer(setLayers, ...args),
            removeLayer: (...args) => removeLayer(setLayers, ...args)
        }),
        []
    )
    return (
        <StackContext.Provider value={context}>
            <LayerView type="initial" key="initial">
                {children}
            </LayerView>
            {layers.map(({ id, props }) => (
                <LayerView id={id} key={id} {...props} />
            ))}
        </StackContext.Provider>
    )
}

export { Stack, Layer, LayerView }
