import React, {
    useLayoutEffect,
    useMemo,
    useRef,
    useContext,
    useState,
    memo
} from 'react'
import PropTypes from 'prop-types'

const LAYER_TYPES = ['initial', 'popup', 'fixed', 'modal', 'global']

const StackContext = React.createContext()
const ParentLayerContext = React.createContext()

const getStyle = (type) =>
    type === 'initial'
        ? { position: 'relative', height: '100%' }
        : { position: 'absolute', top: 0, left: 0 }

const LayerView = React.memo(({ id, children, type }) => (
    <ParentLayerContext.Provider value={id}>
        <div style={getStyle(type)}>{children}</div>
    </ParentLayerContext.Provider>
))

const Layer = memo((props) => {
    let parentId = useContext(ParentLayerContext)
    let stack = useContext(StackContext)
    let idRef = useRef(null)
    useLayoutEffect(() => {
        if (idRef.current === null) {
            if (props.isActive) {
                idRef.current = stack.createLayer(parentId, props)
            }
        } else if (props.isActive) {
            stack.updateLayer(idRef.current, props)
        } else {
            stack.removeLayer(idRef.current)
        }
        return () => {
            if (idRef.current !== null) {
                stack.removeLayer(idRef.current)
                idRef.current = null
            }
        }
    }, [props])
    return <></>
})

Layer.propTypes = {
    /** Controls the visibility of the layer. */
    isActive: PropTypes.bool,

    /**
     * Layer type. It is used to sort layers in the stack.
     *
     * Possible layer types in order from bottom to top:
     * `'initial'`, `'popup'`, `'fixed'`, `'modal'`, `'global'`.
     */
    type: PropTypes.oneOf(LAYER_TYPES)
}

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
        let index = LAYER_TYPES.indexOf(props.type)
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

const Stack = ({ children }) => {
    let [layers, setLayers] = useState([])
    let context = useMemo(
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

Stack.propTypes = {}

export { Stack, Layer, LayerView }
