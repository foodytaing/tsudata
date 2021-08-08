import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SWRConfig } from 'swr'
import { Provider as AlertProvider } from 'react-alert'

// import './styles/normalize.css'

const AlertTemplate = ({ style, options, message, close }) => (
    <div style={style}>
      {options.type === 'info' && '!'}
      {options.type === 'success' && ':)'}
      {options.type === 'error' && ':('}
      {message}
      <button onClick={close}>X</button>
    </div>
  )

ReactDOM.render(
    <SWRConfig
        value={{
            fetcher: (...args) => fetch(...args).then(res => res.json())
        }}
    >
        <AlertProvider template={AlertTemplate}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </AlertProvider>
    </SWRConfig>,
  document.getElementById("root")
);
