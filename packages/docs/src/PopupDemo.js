import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import Draggable from 'react-draggable'

import { Popup, Stack, Layer } from 'oriente'

const styles = {
    root: {
        height: window.innerHeight * 2
    },
    menu: {
        fontSize: '14px',
        position: 'fixed',
        top: 10,
        right: 10,
        width: 150,
        background: '#eee',
        padding: 10,
        paddingBottom: 0,
        boxSizing: 'border-box',
        border: '1px solid #ccc'
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    label: {
        marginRight: 5
    },
    row: {
        marginBottom: 10
    },
    input: {
        width: 60
    },
    target: {
        position: 'absolute',
        width: 120,
        height: 50,
        background: '#666',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'move',
        userSelect: 'none',
        borderRadius: 3,
        letterSpacing: '1px',
        willChange: 'transform'
    },
    popup: {
        position: 'absolute',
        width: 180,
        height: 75,
        display: 'flex',
        background: '#ccc',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        userSelect: 'none',
        borderRadius: 3,
        letterSpacing: '1px',
        willChange: 'transform'
    }
}

const PopupExample = () => {
    const [big, setBig] = useState(false)
    const [pos, setPos] = useState({
        top: 100,
        left: 100
    })
    const [isActive, setIsActive] = useState(true)
    const [placement, setPlacement] = useState({
        side: 'bottom',
        align: 'start',
        flip: true,
        constrain: false,
        padding: 10,
        offset: 0
    })

    const sideOptions = ['top', 'bottom', 'left', 'right'].map((value) => (
        <option value={value} key={value}>
            {value}
        </option>
    ))

    const alignOptions = ['start', 'end', 'center'].map((value) => (
        <option value={value} key={value}>
            {value}
        </option>
    ))

    const menu = (
        <div style={styles.menu}>
            <div style={styles.row}>
                <input
                    type="checkbox"
                    style={{ verticalAlign: 'middle' }}
                    checked={isActive}
                    onChange={(e) => setIsActive((v) => !v)}
                />
                <span style={styles.label}>active</span>
            </div>

            <div style={styles.title}>side</div>
            <div style={styles.row}>
                <select
                    value={placement.side}
                    onChange={(e) =>
                        setPlacement((val) => ({
                            ...val,
                            side: e.target.value
                        }))
                    }
                >
                    {sideOptions}
                </select>
            </div>

            <div style={styles.title}>align</div>
            <div style={styles.row}>
                <select
                    value={placement.align}
                    onChange={(e) =>
                        setPlacement((val) => ({
                            ...val,
                            align: e.target.value
                        }))
                    }
                >
                    {alignOptions}
                </select>
            </div>

            <div style={styles.title}>offset</div>
            <div style={styles.row}>
                <input
                    style={styles.input}
                    checked={placement.offset}
                    onChange={(e) =>
                        setPlacement((val) => ({
                            ...val,
                            offset: Number(e.target.value)
                        }))
                    }
                />
            </div>

            <div style={styles.title}>padding</div>
            <div style={styles.row}>
                <input
                    style={styles.input}
                    checked={placement.padding}
                    onChange={(e) =>
                        setPlacement((val) => ({
                            ...val,
                            padding: Number(e.target.value)
                        }))
                    }
                />
            </div>

            <div style={styles.row}>
                <input
                    type="checkbox"
                    style={{ verticalAlign: 'middle' }}
                    checked={placement.flip}
                    onChange={(e) =>
                        setPlacement((val) => ({ ...val, flip: !val.flip }))
                    }
                />
                <span style={styles.label}>flip</span>
            </div>

            <div style={styles.row}>
                <input
                    type="checkbox"
                    style={{ verticalAlign: 'middle' }}
                    value={placement.constrain}
                    onChange={(e) =>
                        setPlacement((val) => ({
                            ...val,
                            flip: !val.constrain
                        }))
                    }
                />
                <span style={styles.label}>constrain</span>
            </div>
        </div>
    )

    const target = (ref) => (
        <Draggable
            onDrag={(e, data) => setPos({ left: data.x, top: data.y })}
            position={{ x: pos.left, y: pos.top }}
        >
            <div ref={ref} style={styles.target}>
                TARGET
            </div>
        </Draggable>
    )

    const popup = (ref) => (
        <Layer>
            <div ref={ref} style={{ ...styles.popup, height: big ? 200 : 100 }}>
                ELEMENT
                <button onClick={() => setBig((v) => !v)}>toggle size</button>
            </div>
        </Layer>
    )

    return (
        <div style={styles.root}>
            {menu}
            <Popup isActive={isActive} popup={popup} placement={placement}>
                {target}
            </Popup>
        </div>
    )
}

ReactDOM.render(
    <Stack>
        <PopupExample />
    </Stack>,
    document.querySelector('#root')
)
