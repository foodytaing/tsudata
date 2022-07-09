import React from "react";
import Routes from "./Routes";
import Footer from "./components/Footer"

import logo from "./img/tsudata-logo.png"

const App = () => {
  return (
    <>
      <header className="container">
        <img src={logo} alt="tsudata" className="logo-tsudata" />
      </header>
      <Routes />
      <Footer />
    </>
  );
};
export default App;
