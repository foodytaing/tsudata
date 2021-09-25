import React, { Component } from "react";

import "./footer.scss";

class Footer extends Component {
  render() {
    return (
      <footer className="footer-container">
        <span className="footer-copyright">© TsuData 2021 v1.0.0</span>
        <ul className="footer-keyword">
          <li>
            Captain Tsubasa Dream Team / Captain Tsubasa Tatakae Dream Team
          </li>
          <li>Klab Game / Gacha Game / Jeu Mobile</li>
        </ul>
      </footer>
    );
  }
}

export default Footer;