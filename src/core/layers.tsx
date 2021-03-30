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

interface LayerProps {
    /** Controls the visibility of the layer. */
    isActive: boolean

    /**
     * Layer type. It is used to sort layers in the stack.
     *
     * Possible layer types in order from bottom to top:
     * `'initial'`, `'popup'`, `'fixed'`, `'modal'`, `'global'`.
     */
    type: LayerType

    /**
     * Content of the layer
     */
    children: React.ReactNode
}

interface StackContextType {
    createLayer: (parentId: number, props: LayerProps) => number
    updateLayer: (id: number, props: LayerProps) => void
    removeLayer: (id: number) => void
}

const StackContext = createContext<StackContextType | undefined>(undefined)
const ParentLayerContext = createContext<number>(-1)

const getStyle = (type: LayerType): React.CSSProperties =>
    type === 'initial'
        ? { position: 'relative', height: '100%' }
        : { position: 'absolute', top: 0, left: 0 }

interface LayerViewProps {
    id: number
    children: React.ReactNode
    type: LayerType
}

const LayerView = memo(({ id, children, type }: LayerViewProps) => (
    <ParentLayerContext.Provider value={id}>
        <div style={getStyle(type)}>{children}</div>
    </ParentLayerContext.Provider>
))

const Layer = memo((props: LayerProps) => {
    const parentId = useContext(ParentLayerContext)
    const stack = useContext(StackContext)
    if (!stack) {
        throw new Error('Errir')
    }
    const idRef = useRef<number | null>(null)
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

interface LayerInfo {
    id: number
    props: LayerProps
}

type LayersSetState = (
    callback: (prevLayers: LayerInfo[]) => LayerInfo[]
) => void

let id = 0
const getNextId = () => id++

const createLayer = (
    setLayers: LayersSetState,
    parentId: number,
    props: LayerProps
) => {
    const newId = getNextId()
    setLayers((prevLayers) => {
        // Skip all layers until the parent layer
        const skippedParents =
            parentId !== undefined
                ? prevLayers.findIndex(({ id }) => id === parentId) + 1
                : 0

        // Skip all layers with index lower than or equal to the index of the new layer
        const index = LAYER_TYPES.indexOf(props.type)
        let skipped
        for (skipped = skippedParents; skipped < prevLayers.length; skipped++) {
            const nextLayer = prevLayers[skipped]
            if (!nextLayer) break
            if (index < LAYER_TYPES.indexOf(nextLayer.props.type)) break
        }

        return [
            ...prevLayers.slice(0, skipped),
            { id: newId, props },
            ...prevLayers.slice(skipped)
        ]
    })
    return newId
}

const updateLayer = (
    setLayers: LayersSetState,
    id: number,
    props: LayerProps
) => {
    setLayers((prevLayers) =>
        prevLayers.map((layer) =>
            id === layer.id ? { ...layer, props } : layer
        )
    )
}

const removeLayer = (setLayers: LayersSetState, id: number) =>
    setLayers((prevLayers) => prevLayers.filter((layer) => id !== layer.id))

interface StackProps {
    children: React.ReactNode
}

const Stack = ({ children }: StackProps) => {
    const [layers, setLayers] = useState<LayerInfo[]>([])
    const context = useMemo<StackContextType>(
        () => ({
            createLayer: (...args) => createLayer(setLayers, ...args),
            updateLayer: (...args) => updateLayer(setLayers, ...args),
            removeLayer: (...args) => removeLayer(setLayers, ...args)
        }),
        []
    )
    return (
        <StackContext.Provider value={context}>
            <LayerView id={-1} type="initial" key="initial">
                {children}
            </LayerView>
            {layers.map(({ id, props }) => (
                <LayerView id={id} key={id} {...props} />
            ))}
        </StackContext.Provider>
    )
}

export { Stack, Layer, LayerView }
