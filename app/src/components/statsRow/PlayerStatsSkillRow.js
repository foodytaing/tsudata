import React from "react";
import { calcStatTechnique } from "../../utils/calculator";
import FontAwesome from 'react-fontawesome'

export const classStatColor = (value, type) => {
  let high, medium, low;

  if (type == "shot" || type == "highball" || type == "lowball" || type == "catch" || type == "punch") {
    high = 305;
    medium = 280;
  } else if (type == "tackle" || type == "dribble" || type == "intercept" || type == "pass" || type == "onetwo") {
    high = 260;
    medium = 235;
  } else if (type == "block") {
    high = 280;
    medium = 255;
  }

  if (value >= high) {
    return 'high'
  } else if (value >= medium) {
    return 'medium'
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