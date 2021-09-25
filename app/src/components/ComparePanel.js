import React, { useState, useEffect, useRef } from "react";
import { DetailStatsPlayer } from "./DetailStatsPlayer";
import FontAwesome from 'react-fontawesome'

import "./comparePanel.scss";

export const ComparePanel = (props) => {
  const {
    players = [],
    handleDeletePlayerOnPanel,
    handleClearPlayerOnPanel
  } = props

  const [showPanel, setShowPanel] = useState(false)

  const prevPlayerLengthRef = useRef();

  function handleShowPanel() {
    setShowPanel(!showPanel);
  }

  useEffect(() => {
    if (showPanel === false && Array.isArray(players) && players.length === 1 && prevPlayerLengthRef.current === 0) {
      setShowPanel(true);
    }

    if (showPanel === true && Array.isArray(players) && players.length === 0) {
      setShowPanel(false);
    }

    prevPlayerLengthRef.current = Array.isArray(players) && players.length;
  }, [players])

  return (
    <div className={`compare-panel compare-panel--${showPanel ? "open" : "close"}`}>
      <div className="compare-panel__menu">

        <button className="compare-panel__btn-open" onClick={handleShowPanel}>
          {showPanel ? (
            <FontAwesome
              name="chevron-right"
            />
          ) : (
            <FontAwesome
              name="chevron-left"
            />
          )}
        </button>
        <ul className="compare-panel__player-img-list">
          {Array.isArray(players) && players.length > 0 ? (
            players.map((player, index) => {
              return (
                <li key={player.keyId} className="compare-panel__player-img-list__item">
                  <div key={player.keyId} className="compare-panel__player-img-list__wrapper-img">
                    <img
                      src={player?.image_url ? `https://res.cloudinary.com/dcty4rvff/image/upload/c_scale,h_50/${player?.image_url.path}` : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
                      alt={player?.first_name + '_' + player?.last_name}
                    />
                  </div>
                  <button className="compare-panel__btn-delete" onClick={() => handleDeletePlayerOnPanel(index)}>
                    <FontAwesome
                      name="minus"
                    />
                  </button>
                </li>
              )
            })
          ) : null}
        </ul>
        <button className="compare-panel__btn-clear" onClick={handleClearPlayerOnPanel}>
          <FontAwesome
            name="trash"
          />
        </button>
      </div>
      <div className="compare-panel__content">
        <ul className="compare-panel__player-detail-list">
          {Array.isArray(players) && players.length > 0 ? (
            players.map((player, index) => {
              return (
                <li className="compare-panel__player-detail-list__item" key={player.keyId}>
                  <DetailStatsPlayer
                    player={player}
                    handleDeletePlayerOnPanel={() => handleDeletePlayerOnPanel(index)}
                  />
                </li>
              )
            })
          ) : null}
        </ul>
      </div>
    </div>
  )
}

export default ComparePanel;