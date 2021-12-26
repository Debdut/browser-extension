console.log('[Content] Loaded')

import React from 'react'
import { render } from 'react-dom'
import App from './components/app'
import './index.scss'

const contentHolder = document.createElement('div')
document.body.appendChild(contentHolder)
render(<App />, contentHolder)