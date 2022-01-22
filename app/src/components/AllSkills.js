import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from 'swr'
import axios from "axios";
import { ADD_PLAYER_ON_PANEL } from "../actions/player.action"

import FontAwesome from 'react-fontawesome'
import noImg from '../img/no-img.jpg'

import "./allSkill.scss";

const fetcher = url => fetch(url).then(r => r.json())

const calcStatTechnique = ({ intensity, type, stats, colorAdvantage, goodRead, boostGoodRead }) => {
  let value;
  let typeTech = type === "one" ? "pass" : type;

  switch (type) {
    case 'dribble':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'shot':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'pass':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'one':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      console.log(value)
      break;
    case 'tackle':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'block':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'intercept':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'punch':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'catch':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
      break;
    case 'highball':
      const boostHighBall = (stats["shot"] * (stats["highball"] - 1)) || 0
      typeTech = "shot";
      value = Math.round(intensity / 100 * stats["shot"] + boostHighBall)
      break;
    case 'lowball':
      const boostLowBall = (stats["shot"] * (stats["lowball"] - 1)) || 0
      typeTech = "shot";
      value = Math.round(intensity / 100 * parseInt(stats["shot"]) + boostLowBall)
      break;
    default:
      return intensity
  }

  if (goodRead) {
    let calcGoodRead = stats[typeTech] * (boostGoodRead / 100) || 0
    console.log(boostGoodRead / 100);

    return Math.trunc((calcGoodRead + value + stats[typeTech]) / 1000);
  } else {
    return Math.trunc(value / 1000);
  }
};

export const AllSkills = (props) => {
  const dispatch = useDispatch();
  const playersOnPanel = useSelector((state) => state.playerReducer);

  const {
    firstName = "",
    lastName = "",
    id,
    keyId,
    index,
    intensity = 1,
    calcStats = {},
    good_read = 0
  } = props

  const currentPlayer = playersOnPanel[index];
  const allReadyFetch = (Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.length) || 0;

  const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/player?last_name=${lastName}&first_name=${firstName}`, fetcher)

  let techniques = [];
  let allTechniques = [];

  console.log(data)

  if (allReadyFetch === 0) {
    Array.isArray(data) && data.forEach((el, index) => {
      el.techniques.forEach(id => techniques.push({ id: id, image_url: el.image_url, chest: el.chest }))

      if (data.length === (index + 1)) {
        techniques.forEach((tech, i) => {
          axios
            .get(`${process.env.REACT_APP_API_URL}/api/technique/${tech.id}`)
            .then((res) => {
              allTechniques.push({ ...res.data, image_url: tech.image_url, chest: tech.chest });

              if (techniques.length === allTechniques.length) {
                let newPlayersOnPanel = [...playersOnPanel]

                newPlayersOnPanel.forEach((player, index) => {
                  if (keyId == player?.keyId) {
                    newPlayersOnPanel[index].allTechniques = allTechniques
                    dispatch({ type: ADD_PLAYER_ON_PANEL, payload: newPlayersOnPanel });
                  }
                })
              }

            }).catch((err) => console.log(err))
        })
      }
    })
  }

  const formatData = [
    {
      type: "dribble",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "dribble").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "shot",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "shot").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "pass",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "pass").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "one",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "one-two").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "tackle",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "tackle").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "block",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "block").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "intercept",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "intercept").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "highball",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "highball").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "lowball",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "lowball").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "punch",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "punch").sort(function (a, b) { return b.intensity - a.intensity })
    },
    {
      type: "catch",
      data: Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.filter(data => data.type_technique === "catch").sort(function (a, b) { return b.intensity - a.intensity })
    }
  ]

  const calcIntensity = intensity / 100 + 1 || 1;

  return (
    <div className="all-technique-wrapper">
      <div className="all-technique">
        <span className="all-technique__title">
          Techniques spéciales
        </span>
        <ul className="all-technique__list">
          {
            formatData.map((data, index) => {
              if (data.data.length) {
                return (
                  <Fragment key={index}>
                    {data.data.map((tech, i) => {
                      if (tech.rank === "s") {
                        return (
                          <li className="all-technique__item" key={"tech" + i + "_" + keyId + "_" + tech._id + "_" + data.type}>
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
                            </div>
                            <div className="all-technique__infomations">
                              <div className="all-technique__rank-wrapper">
                                <div>
                                  <span className="all-technique__rank">{tech?.rank}</span> - <span className="all-technique__type">{tech?.type_technique}</span>
                                </div>
                                <div>
                                  <span className={`all-technique__intensity ${intensity > 1 ? 'all-technique__intensity--boosted' : ''}`}>
                                    <FontAwesome
                                      name="fire"
                                    />
                                    {Math.round(tech?.intensity * calcIntensity)}
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
                                  <span>Bonne Lecture (+{good_read}%) :</span>
                                  <span>{calcStatTechnique({ stats: calcStats, intensity: tech?.intensity * calcIntensity, type: data.type, goodRead: true, boostGoodRead: good_read })}K</span>
                                </span>
                                <span className="final-stats__stats">
                                  <span></span>
                                  <span className="final-stats__main-stats">{calcStatTechnique({ stats: calcStats, intensity: tech?.intensity * calcIntensity, type: data.type, goodRead: false })}K</span>
                                </span>
                              </div>
                            </div>
                          </li>
                        )
                      }
                    })}
                  </Fragment>
                )
              }
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default AllSkills;