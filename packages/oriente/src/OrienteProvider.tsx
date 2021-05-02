import React from 'react'

import { Stack } from './layers'
import { ToastContainer } from './toast'

const OrienteProvider = ({ children }: { children: React.ReactNode }) => (
    <Stack>
        <ToastContainer>{children}</ToastContainer>
    </Stack>
)

export default OrienteProvider
