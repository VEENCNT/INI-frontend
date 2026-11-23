import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App.tsx'
import { installMockApi, isMockMode } from './api/mockApi'
import { registerServiceWorker } from './pwa'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './App.css'

// GitHub Pages работает без бэкенда: в демо-режиме все запросы к API
// обслуживаются локальным mock-адаптером.
if (isMockMode()) {
  installMockApi()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

registerServiceWorker()
