import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { SWRConfig } from 'swr'

ReactDOM.render(
    <SWRConfig
        value={{
            fetcher: (...args) => fetch(...args).then(res => res.json())
        }}
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </SWRConfig>,
  document.getElementById("root")
);
