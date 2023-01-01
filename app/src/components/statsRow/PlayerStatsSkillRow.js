import React from "react";
import { calcStatTechnique } from "../../utils/calculator";
import FontAwesome from 'react-fontawesome'

export const classStatColor = (value, type) => {
  let limit;

  if (type == "shot" || type == "highball" || type == "lowball" || type == "catch" || type == "punch") {
    limit = 370;
  } else if (type == "tackle" || type == "dribble" || type == "intercept" || type == "pass" || type == "onetwo") {
    limit = 320;
  } else if (type == "block") {
    limit = 320;
  }

  if (value >= limit) {
    return 'high'
  } else if (value >= (limit - 25)) {
    return 'medium'
  } else if (value >= (limit - 50)) {
    return 'low'
  } else {
    return null
  }
}

export const PlayerStatsSkillRow = (props) => {
  const {
    skill,
    type,
    stats,
    calcIntensity,
    boostGoodRead
  } = props
  const intensity = calcIntensity / 100 + 1 || 1

  const statValue = calcStatTechnique({ stats: stats, intensity: skill?.intensity * intensity, type: type, boostGoodRead: boostGoodRead });

  return (
    <div className="player-stats__stats-skill">
      {
        (skill?.name) ? (
          <>
            <span className="player-stats__stats-skill-name">
              {skill?.name} <span>({skill?.intensity}) {skill?.combination ? (
                <>
                  <FontAwesome
                    name="user"
                  />
                  <FontAwesome
                    name="user"
                  />
                </>
              ) : null}</span>
            </span>
            <span className={`player-stats__stats-skill-stats player-stats__stats-skill-stats--${classStatColor(statValue, type)}`}>
              {statValue}K
            </span>
          </>
        ) : null
      }
    </div>
  )
}

export default PlayerStatsSkillRow;