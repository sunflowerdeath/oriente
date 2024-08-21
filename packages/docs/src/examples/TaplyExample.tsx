import { useState } from 'react'
import { useTaply, TapState, Col, Row } from 'oriente'

import buttonStyle from '../buttonStyle'

const style = (state: TapState) => ({
    ...buttonStyle,
    outline: state.isFocused ? '2px solid cornflowerblue' : 'none'
})

const TaplyExample = () => {
    const [isDisabled, setIsDisabled] = useState(false)
    const [preventFocusOnTap, setPreventFocusOnTap] = useState(true)
    const [preventFocusSteal, setPreventFocusSteal] = useState(false)
    const { tapState, render } = useTaply({
        onClick: () => console.log('onclick'),
        isDisabled,
        preventFocusOnTap,
        preventFocusSteal
    })
    return (
        <Col gap={10}>
            <Row gap={10}>
                {render((attrs, ref) => (
                    <div style={style(tapState)} {...attrs} ref={ref}>
                        Button
                    </div>
                ))}
                <input />
            </Row>
            <Row gap={10}>
                <label>
                    <input
                        type="checkbox"
                        onChange={() => setIsDisabled((v) => !v)}
                        checked={isDisabled}
                    />
                    isDisabled
                </label>
                <label>
                    <input
                        type="checkbox"
                        onChange={() => setPreventFocusOnTap((v) => !v)}
                        checked={preventFocusOnTap}
                    />
                    preventFocusOnTap
                </label>
                <label>
                    <input
                        type="checkbox"
                        onChange={() => setPreventFocusSteal((v) => !v)}
                        checked={preventFocusSteal}
                    />
                    preventFocusSteal
                </label>
            </Row>
        </Col>
    )
}

export { TaplyExample }
