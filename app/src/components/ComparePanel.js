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

  window.onhashchange = function () {
    alert("stop");
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

  let numberFreeSlot = 3 - players.length;
  let rows = [];
  for (let i = 0; i < numberFreeSlot; i++) {
    rows.push(i);
  }

  return (
    <div className={`compare-panel compare-panel--${showPanel ? "open" : "close"}`}>
      <div className="compare-panel__menu">

        <button className="compare-panel__btn-open" onClick={handleShowPanel}>
          {showPanel ? (
            <FontAwesome
              name="chevron-left"
            />
          ) : (
            <FontAwesome
              name="chevron-right"
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
                      src={player?.image_url ? `https://res.cloudinary.com/dcty4rvff/image/upload/c_scale,h_100/${player?.image_url.path}` : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
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
          {
            rows.map((row, index) => {
              return (
                <li className="compare-panel__player-img-list__item compare-panel__player-img-list__item--empty" key={"free_row_" + index} onClick={() => setShowPanel(false)}>
                  <FontAwesome
                    name="plus"
                  />
                </li>
              )
            })
          }
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
                    index={index}
                    handleDeletePlayerOnPanel={() => handleDeletePlayerOnPanel(index)}
                  />
                </li>
              )
            })
          ) : null}
          {
            Array.isArray(players) && players.length < 3 ? (
              <>
                <li className="compare-panel__player-detail-list__item compare-panel__player-detail-list__item--empty" onClick={() => setShowPanel(false)}>
                  <div>
                    <FontAwesome
                      name="plus"
                    />
                    <span className="compare-panel__player-detail-list__item-empty">Ajouter un personnage</span>
                  </div>
                </li>
              </>
            ) : null
          }
        </ul>
      </div>
    </div>
  )
}

export default ComparePanel;