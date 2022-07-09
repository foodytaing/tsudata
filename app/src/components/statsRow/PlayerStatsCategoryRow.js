import React from "react";

export const PlayerStatsCategoryRow = (props) => {
  const {
    label,
    value
  } = props

  return (
    <div className="player-stats__row player-stats__row--category">
      <span className="player-stats__label">{label}</span>
      <span className="player-stats__value">{value}</span>
    </div>
  )
}

export default PlayerStatsCategoryRow;