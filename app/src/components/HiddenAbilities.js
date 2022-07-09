import React from "react";
import FontAwesome from 'react-fontawesome'

import "./hiddenAbilities.scss";

export const HiddenAbilities = (props) => {
  const {
    hiddenAbilities,
    orderHiddenAbilities,
    passiveSkill,
    orderPassiveSkill,
    leaderSkill,
    orderLeaderSkill,
    setSkillBoost,
    active_skills
  } = props

  return (
    <div className="skills-wrapper">
      <div className="leader-skill">
        <span className="leader-skill__title">Compétence d'équipe</span>
        <ul className="leader-skill__list">
          {
            orderLeaderSkill.map(id => {
              const ls = leaderSkill[id]

              return (
                <li className="leader-skill__item" key={ls._id}>
                  <span className="leader-skill__name"><span className="leader-skill__rank">{ls.rank}</span> - {ls.name}</span>
                  <p className="leader-skill__desc">{ls.description}</p>
                </li>
              )
            })
          }
        </ul>
      </div>

      <div className="passive-skill">
        <span className="passive-skill__title">Compétence passive</span>
        <ul className="passive-skill__list">
          {
            orderPassiveSkill.map(id => {
              const ps = passiveSkill[id]

              return (
                <li className="passive-skill__item" key={ps._id}>
                  {ps.effect_value && ps.effect_type && ps.name.toLowerCase() !== "lien" ? (
                    <span onClick={() => setSkillBoost(ps)} className="check-box-boost">
                      {active_skills && active_skills[ps._id] === true ? (
                        <FontAwesome
                          name="check"
                        />
                      ) : null}
                    </span>
                  ) : null}
                  <span className="passive-skill__name"><span className="passive-skill__rank">{ps.rank}</span> - {ps.name}</span>
                  <p className="passive-skill__desc">{ps.description}</p>
                </li>
              )
            })
          }
        </ul>
      </div>

      {
        orderHiddenAbilities.length > 0 ? (
          <div className="hidden-abilities">
            <span className="hidden-abilities__title">Compétence potentielle</span>
            <ul className="hidden-abilities-list">
              {
                orderHiddenAbilities.map(id => {
                  const ha = hiddenAbilities[id]

                  return (
                    <li className="hidden-abilities-list__item" key={ha._id}>
                      {ha.effect_value && ha.effect_type && ha.name.toLowerCase() !== "lien" ? (
                        <span onClick={() => setSkillBoost(ha)} className="check-box-boost">
                          {active_skills && active_skills[ha._id] === true ? (
                            <FontAwesome
                              name="check"
                            />
                          ) : null}
                        </span>
                      ) : null}
                      <span className="hidden-abilities-list__name">{ha.name}</span>
                      <p className="hidden-abilities-list__desc">{ha.description}</p>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        ) : null
      }
    </div>
  );
};

export default HiddenAbilities;