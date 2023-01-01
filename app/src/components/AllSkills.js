import React, { Fragment } from "react";
import { calcStatTechnique } from "../utils/calculator";

import FontAwesome from 'react-fontawesome'
import noImg from '../img/no-img.jpg'

import "./allSkill.scss";

export const AllSkills = (props) => {
  const {
    keyId,
    intensity = 1,
    calcStats = {},
    active_skills_boost,
    moveset,
    handleSetMoveset,
    allTechniques
  } = props

  const formatData = [
    {
      type: "dribble",
      label: "Dribble",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "dribble" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "shot",
      label: "Tir",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "shot" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "pass",
      label: "Passe",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "pass" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "onetwo",
      label: "Une Deux",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "onetwo" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "tackle",
      label: "Tacle",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "tackle" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "block",
      label: "Contre",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "block" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "intercept",
      label: "Interception",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "intercept" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "highball",
      label: "Ballon Haut (Tête)",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "highball" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "lowball",
      label: "Ballon Bas (Volée)",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "lowball" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "punch",
      label: "Coup de poing",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "punch" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    },
    {
      type: "catch",
      label: "Arrêt",
      data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "catch" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity || a.name.localeCompare(b.name) })
    }
  ]

  return (
    <div className="all-technique-wrapper">

      <div className="all-technique">
        {formatData.map((data, index) => {
          if (data.data.length > 0) {

            return (
              <Fragment key={index}>
                <span className="all-technique__title">
                  {data.label}
                </span>
                <ul className="all-technique__list">
                  {data.data.map((tech, i) => {
                    const isActivate = (tech?._id === moveset[tech.type_technique]?._id);
                    const isActivateClass = isActivate ? "all-technique__item--active" : "";

                    return (
                      <li
                        onClick={() => handleSetMoveset(tech)}
                        className={"all-technique__item" + " " + isActivateClass}
                        key={"tech" + i + "_" + keyId + "_" + tech._id + "_" + data.type}
                      >
                        <div className="all-technique__img-wrapper">
                          <img
                            className="all-technique__img"
                            src={tech?.image_url ? `https://res.cloudinary.com/dcty4rvff/image/upload/c_scale,h_75/${tech?.image_url.path}` : noImg}
                          />
                          {
                            tech.chest === "true" ? (
                              <span className="badge-free all-technique__gift">
                                <FontAwesome
                                  name="gift"
                                />
                              </span>
                            ) : null
                          }
                          {
                            tech.index === 0 && tech?.image_url ? (
                              <span className="badge-free all-technique__lock">
                                <FontAwesome
                                  name="lock"
                                />
                              </span>
                            ) : null
                          }
                        </div>
                        <div className="all-technique__infomations">
                          <div className="all-technique__rank-wrapper">
                            <div className="all-technique__col all-technique__col--left">
                              <span className="all-technique__rank">{tech?.rank}</span> - <span className="all-technique__type">{tech?.type_technique}</span>
                              {tech.combination ? (
                                <>
                                  <FontAwesome
                                    name="user"
                                  />
                                  <FontAwesome
                                    name="user"
                                  />
                                </>
                              ) : null}
                            </div>
                            <div className="all-technique__col all-technique__col--right">
                              <span className={`all-technique__intensity ${(intensity + active_skills_boost["intensity_" + data.type] / 100 + 1 || 1) > 1 ? 'all-technique__intensity--boosted' : ''}`}>
                                <FontAwesome
                                  name="fire"
                                />
                                {Math.round(tech?.intensity * (intensity + active_skills_boost["intensity_" + data.type] / 100 + 1 || 1))}
                              </span>
                              <span className="all-technique__stamina">
                                <FontAwesome
                                  name="bolt"
                                />
                                {tech?.stamina}
                              </span>
                            </div>
                          </div>
                          <span className="all-technique__name">{tech.name}</span>
                          <div className="all-technique__final-stats final-stats">
                            <span className="final-stats__stats">
                              <span></span>
                              <span className="final-stats__main-stats">{calcStatTechnique({ stats: calcStats, intensity: tech?.intensity * (intensity + active_skills_boost["intensity_" + data.type] / 100 + 1 || 1), type: data.type, goodRead: false })}K</span>
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Fragment>
            )
          }
        })
        }
      </div>
    </div>
  )
}

export default AllSkills;