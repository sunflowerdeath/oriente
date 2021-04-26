import React, { Component } from 'react'
import TestRenderer from 'react-test-renderer'
import assert from 'assert'

import { Stack, Layer, LayerView } from '../layers.js'

describe('layers:', () => {
    it('renders layer', () => {
        // render layer
        const CONTENT = 'content'
        const testRenderer = TestRenderer.create(
            <Stack>
                <Layer isActive={true}>{CONTENT}</Layer>
            </Stack>
        )

        const layers = testRenderer.root.findAllByType(LayerView.type)
        assert.equal(layers[0].props.type, 'initial')
        assert.equal(layers[1].props.children, CONTENT)
        assert.equal(layers[1].props.type, 'popup')
    })

    it('renders layers in correct order', () => {
        // render modal > fixed > popup
        const testRenderer = TestRenderer.create(
            <Stack>
                <Layer isActive={true} type="modal">
                    modal
                </Layer>
                <Layer isActive={true} type="fixed">
                    fixed
                </Layer>
                <Layer isActive={true} type="popup">
                    popup
                </Layer>
            </Stack>
        )

        // rendered initial > popup > fixed > modal
        const layers = testRenderer.root.findAllByType(LayerView.type)
        assert.equal(layers[0].props.type, 'initial')
        assert.equal(layers[1].props.type, 'popup')
        assert.equal(layers[2].props.type, 'fixed')
        assert.equal(layers[3].props.type, 'modal')
    })

    it('renders layers in the context of other layer', () => {
        // render modal with popup and fixed inside
        const testRenderer = TestRenderer.create(
            <Stack>
                <Layer isActive={true} type="modal">
                    modal
                    <Layer isActive={true} type="fixed">
                        fixed
                    </Layer>
                    <Layer isActive={true} type="popup">
                        popup
                    </Layer>
                </Layer>
            </Stack>
        )

        // rendered modal > popup > fixed
        const layers = testRenderer.root.findAllByType(LayerView.type)
        assert.equal(layers[0].props.type, 'initial')
        assert.equal(layers[1].props.type, 'modal')
        assert.equal(layers[2].props.type, 'popup')
        assert.equal(layers[3].props.type, 'fixed')
    })

    it('updates layer content', () => {
        const CONTENT = 'content'
        const NEW_CONTENT = 'new content'

        const Test = ({ children }) => (
            <Stack>
                <Layer isActive={true}>{children}</Layer>
            </Stack>
        )

        // render layer
        const testRenderer = TestRenderer.create(<Test>{CONTENT}</Test>)

        // change content
        // TODO actual update insead of mount/unmount?
        testRenderer.update(<Test>{NEW_CONTENT}</Test>)

        // rendered new content
        const layers = testRenderer.root.findAllByType(LayerView.type)
        assert.equal(layers[1].props.type, 'popup')
        assert.equal(layers[1].props.children, NEW_CONTENT)
    })

    it('closes layer when isActive is false', () => {
        const Test = ({ isActive }) => (
            <Stack>
                <Layer isActive={isActive}>content</Layer>
            </Stack>
        )

        // render layer
        const testRenderer = TestRenderer.create(<Test isActive={true} />)
        assert.equal(testRenderer.root.findAllByType(LayerView.type).length, 2)

        // set open false
        testRenderer.update(<Test isActive={false} />)
        // layer is not rendered
        assert.equal(testRenderer.root.findAllByType(LayerView.type).length, 1)
    })
})
