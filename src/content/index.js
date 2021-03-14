console.log('[Content] Loaded')

import { h, render } from 'preact'
import App from './components/app'
import './index.scss'

const contentHolder = document.createElement('div')
document.body.appendChild(contentHolder)
render(<App />, contentHolder)