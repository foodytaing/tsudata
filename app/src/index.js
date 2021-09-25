import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SWRConfig } from 'swr'
import { Provider as AlertProvider } from 'react-alert'

import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";

import './styles/normalize.css'
import './styles/style.scss'

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

const options = {
    position: 'bottom right',
    timeout: 5000,
    offset: '30px'
}

const AlertTemplate = ({ style, options, message, close }) => (
    <div style={style} className={`alert-message alert-message--${options.type}`}>
        <p className="alert-message__text">{message}</p>
        <button className="alert-message__button" onClick={close}>Fermer</button>
    </div>
)

ReactDOM.render(
    <Provider store={store}>
        <SWRConfig
            value={{
                fetcher: (...args) => fetch(...args).then(res => res.json())
            }}
        >
            <AlertProvider template={AlertTemplate} {...options}>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </AlertProvider>
        </SWRConfig>
    </Provider>,
    document.getElementById("root")
);
