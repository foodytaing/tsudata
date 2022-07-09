import React from "react";
import FontAwesome from 'react-fontawesome'

export const PlayerStatsRow = (props) => {
  const {
    label,
    value,
    lb,
    bb,
    skillsBoostIntensity,
    skillsBoostParams,
    skillsBoostParamsPhy,
    skillsBoostParamsPhytwo,
    skillsBoostGoodRead
  } = props

  return (
    <div className="player-stats__row">
      <div className="player-stats__stats-in-match">
        <div>
          <span className="player-stats__label">
            {label}
          </span>
          {
            lb && lb !== 0 ? (
              <span className="player-stats__lb">
                +{lb}
              </span>
            ) : null
          }
          {
            bb && bb !== 0 ? (
              <span className="player-stats__bb">
                +{bb}
              </span>
            ) : null
          }
          {
            (skillsBoostParams && skillsBoostParams !== 0) || (skillsBoostParamsPhy && skillsBoostParamsPhy !== 0) ? (
              <span className="player-stats__boost_params">
                <FontAwesome name="arrow-up" /> +{skillsBoostParams || skillsBoostParamsPhy || skillsBoostParamsPhytwo}%
              </span>
            ) : null
          }
          {
            skillsBoostIntensity && skillsBoostIntensity !== 0 ? (
              <span className="player-stats__boost_intensity">
                <FontAwesome name="fire" /> +{skillsBoostIntensity}%
              </span>
            ) : null
          }
          {
            skillsBoostGoodRead && skillsBoostGoodRead !== 0 ? (
              <span className="player-stats__boost_good_read">
                <FontAwesome name="eye" /> +{skillsBoostGoodRead}%
              </span>
            ) : null
          }
        </div>
        <div>
          <span className="player-stats__value">{value}</span>
        </div>
      </div>
    </div>
  )
}

export default PlayerStatsRow;
