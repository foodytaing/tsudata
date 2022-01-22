import React, { useState } from "react";
import FontAwesome from 'react-fontawesome'

import lbVal from "../data/limit_break_values.json"
import Tab from "../components/Tab"

import HiddenAbilities from "./HiddenAbilities";
import TechniquesSpecials from "./TechniquesSpecials";
import AllSkills from "./AllSkills";

import "./detailStatsPlayer.scss";

export const floatBallValue = (value) => {
	if (value == 1) {
		return "Normal";
	}
	if (value == 1.125) {
		return "Bon";
	}
	if (value == 1.25) {
		return "Très bon";
	}
};

export const lbCalculator = (value) => {
	return !value || value < 0 || value > 25 ? 0 : lbVal[value];
};

const formationForm = [
	{ name: "stamina", label: "End (%)" },
	{ name: "attack", label: "Att (%)" },
	{ name: "defend", label: "Def (%)" },
	{ name: "physical", label: "Phy (%)" }
]
const limitBreakRegularForm = [
	{ name: "dribble", label: "Dribble" },
	{ name: "tackle", label: "Tacle" },
	{ name: "speed", label: "Rapidité" },
	{ name: "shot", label: "Tir" },
	{ name: "block", label: "Bloc" },
	{ name: "power", label: "Puissance" },
	{ name: "pass", label: "Passe" },
	{ name: "intercept", label: "Interception" },
	{ name: "technique", label: "Technique" }
]
const limitBreakGkForm = [
	{ name: "punch", label: "Coup de poing" },
	{ name: "speed", label: "Rapidité" },
	{ name: "" },
	{ name: "catch", label: "Arrêt" },
	{ name: "power", label: "Puissance" },
	{ name: "" },
	{ name: "" },
	{ name: "technique", label: "Technique" },
	{ name: "" }
]
const boostForm = [
	{ name: "leader_skill", label: "LS (%)" },
	{ name: "bond", label: "Lien (%)" },
	{ name: "params", label: "Params (%)" },
]
const boostIntensity = [
	{ name: "intensity", label: "Intensité (%)" },
	{ name: "good_read", label: "Bonne lecture (%)" }
]

const orderPosition = ['at', 'mo', 'md', 'df', 'gb'];

export const DetailStatsPlayer = (props) => {
	const {
		player,
		handleDeletePlayerOnPanel,
		index
	} = props

	const [boost, setBoost] = useState({
		leader_skill: 69, params: "", bond: 40, intensity: "", good_read: "",
		dribble: 25, shot: 25, pass: 25, tackle: 25, block: 25, intercept: 25, speed: 25, power: 25, technique: 25, catch: 25, punch: 25,
		attack: "", defend: "", physical: 10, saving: "", stamina: ""
	})

	const isGk = Array.isArray(player?.positions) && player?.positions.includes("gb");

	const params = parseInt(boost.params) || 0;
	const leader_skill = parseInt(boost.leader_skill) || 0;
	const bond = parseInt(boost.bond) || 0;
	const intensity = parseInt(boost.intensity) || 0;
	const good_read = parseInt(boost.good_read) || 0;
	const lbDribble = parseInt(boost.dribble) || 0;
	const lbShot = parseInt(boost.shot) || 0;
	const lbPass = parseInt(boost.pass) || 0;
	const lbTackle = parseInt(boost.tackle) || 0;
	const lbBlock = parseInt(boost.block) || 0;
	const lbIntercept = parseInt(boost.intercept) || 0;
	const lbSpeed = parseInt(boost.speed) || 0;
	const lbPower = parseInt(boost.power) || 0;
	const lbTechnique = parseInt(boost.technique) || 0;
	const lbSavingCatch = parseInt(boost.catch) || 0;
	const lbSavingPunch = parseInt(boost.punch) || 0;
	const attack = parseInt(boost.attack) || 0;
	const defend = parseInt(boost.defend) || 0;
	const physical = parseInt(boost.physical) || 0;
	const saving = parseInt(boost.defend) || 0;
	const stamina = parseInt(boost.stamina) || 0;

	const stats = {
		dribble: parseInt(player?.stats?.dribble) || 0,
		shot: parseInt(player?.stats?.shot) || 0,
		pass: parseInt(player?.stats?.pass) || 0,
		tackle: parseInt(player?.stats?.tackle) || 0,
		block: parseInt(player?.stats?.block) || 0,
		intercept: parseInt(player?.stats?.intercept) || 0,
		speed: parseInt(player?.stats?.speed) || 0,
		power: parseInt(player?.stats?.power) || 0,
		technique: parseInt(player?.stats?.technique) || 0,
		catch: parseInt(player?.stats?.catch) || 0,
		punch: parseInt(player?.stats?.punch)
	}

	const totalAttack = (stats.dribble || 0) + (stats.shot || 0) + (stats.pass || 0);
	const totalDefend = (stats.tackle || 0) + (stats.block || 0) + (stats.intercept || 0);
	const totalPhysical = (stats.speed || 0) + (stats.power || 0) + (stats.technique || 0);
	const totalSaving = (stats.catch || 0) + (stats.punch || 0);
	const total = totalAttack + totalDefend + totalSaving + totalPhysical;

	const calcLbDribble = (lbCalculator(boost.dribble) + lbCalculator(boost.speed) / 2) || 0
	const calcLbShot = (lbCalculator(boost.shot) + lbCalculator(boost.power) / 2) || 0
	const calcLbPass = (lbCalculator(boost.pass) + lbCalculator(boost.technique) / 2) || 0
	const calcLbTackle = (lbCalculator(boost.tackle) + lbCalculator(boost.speed) / 2) || 0
	const calcLbBlock = (lbCalculator(boost.block) + lbCalculator(boost.power) / 2) || 0
	const calcLbIntercept = (lbCalculator(boost.intercept) + lbCalculator(boost.technique) / 2) || 0
	const calcLbPunch = (lbCalculator(boost.punch) + (lbCalculator(boost.speed) + lbCalculator(boost.power)) / 2) || 0
	const calcLbCatch = (lbCalculator(boost.catch) + (lbCalculator(boost.technique) + lbCalculator(boost.power)) / 2) || 0

	const calcDribble = (stats.dribble + lbCalculator(lbDribble)) * ((attack + leader_skill) / 100 + 1 || 1);
	const calcShot = (stats.shot + lbCalculator(lbShot)) * ((attack + leader_skill) / 100 + 1 || 1);
	const calcPass = (stats.pass + lbCalculator(lbPass)) * ((attack + leader_skill) / 100 + 1 || 1);
	const calcTackle = (stats.tackle + lbCalculator(lbTackle)) * ((defend + leader_skill) / 100 + 1 || 1);
	const calcBlock = (stats.block + lbCalculator(lbBlock)) * ((defend + leader_skill) / 100 + 1 || 1);
	const calcIntercept = (stats.intercept + lbCalculator(lbIntercept)) * ((defend + leader_skill) / 100 + 1 || 1);
	const calcSpeed = (stats.speed + lbCalculator(lbSpeed)) * ((physical + leader_skill) / 100 + 1 || 1);
	const calcPower = (stats.power + lbCalculator(lbPower)) * ((physical + leader_skill) / 100 + 1 || 1);
	const calcTechnique = (stats.technique + lbCalculator(lbTechnique)) * ((physical + leader_skill) / 100 + 1 || 1);
	const calcSavingPunch = (stats.punch + lbCalculator(lbSavingPunch)) * ((leader_skill) / 100 + 1 || 1);
	const calcSavingCatch = (stats.catch + lbCalculator(lbSavingCatch)) * ((leader_skill) / 100 + 1 || 1);

	const calcStats = {
		dribble: Math.round((calcDribble + calcSpeed / 2) * ((params + bond) / 100 + 1 || 1)),
		shot: Math.round((calcShot + calcPower / 2) * ((params + bond) / 100 + 1 || 1)),
		pass: Math.round((calcPass + calcTechnique / 2) * ((params + bond) / 100 + 1 || 1)),
		tackle: Math.round((calcTackle + calcSpeed / 2) * ((params + bond) / 100 + 1 || 1)),
		block: Math.round((calcBlock + calcPower / 2) * ((params + bond) / 100 + 1 || 1)),
		intercept: Math.round((calcIntercept + calcTechnique / 2) * ((params + bond) / 100 + 1 || 1)),
		punch: Math.round((calcSavingPunch + (calcSpeed + calcPower) / 4) * ((params + bond) / 100 + 1 || 1)),
		catch: Math.round((calcSavingCatch + (calcPower + calcTechnique) / 4) * ((params + bond) / 100 + 1 || 1)),
		highball: player?.stats?.highBall,
		lowball: player?.stats?.lowBall
	}

	const calcIntensity = intensity / 100 + 1 || 1

	const calcTotalAttack = (calcStats.dribble || 0) + (calcStats.shot || 0) + (calcStats.pass || 0)
	const calcTotalDefend = (calcStats.tackle || 0) + (calcStats.block || 0) + (calcStats.intercept || 0)
	const calcTotalSaving = (calcStats.punch || 0) + (calcStats.catch || 0)

	const calcTotal = calcTotalAttack + calcTotalDefend + calcTotalSaving

	function handleInputChange(e) {
		const target = e?.target;
		const value = target?.type === 'checkbox' ? target?.checked : target?.value;
		const name = target?.name;

		const newBoost = {
			...boost,
			[name]: value
		}

		setBoost(newBoost);
	}

	return (
		<div className="detail-stats-player">
			<h3 className={`detail-stats-player__full-name text-color--${player?.color}`}>
				<span className={`detail-stats-player__flag flag flag--${player?.country && player?.country.toLowerCase()}`} />
				{player?.last_name} {player?.first_name}
				<span className="detail-stats-player__sub-name">
					{player?.sub_name}
				</span>
				<span className={`detail-stats-player__series`}>
					{player?._id}
				</span>
			</h3>

			<div className="detail-stats-player__img-wrapper">
				<img
					className="detail-stats-player__img"
					src={player?.image_url ? `https://res.cloudinary.com/dcty4rvff/image/upload/c_scale,h_170/${player?.image_url.path}` : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
					alt={player?.first_name + '_' + player?.last_name}
				/>
				<ul className='detail-stats-player__positions'>
					{
						Array.isArray(orderPosition) && orderPosition.map((order) => {
							return (
								Array.isArray(player?.positions) && (player?.positions.includes(order)) ? (
									<li key={order + '_' + player.keyId} className={`tag-position tag-position--${order.toLowerCase()}`}>
										{order}
									</li>
								) : null
							)
						})
					}
				</ul>
			</div>

			<Tab defaultIndex={1}>
				<div tab="Stats">
					<div className="detail-stats-player__stats">
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsRow label="Endurance" value={player?.stats?.stamina} />
						</div>
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsCategory label="Total" value={total} />
						</div>
						{
							isGk ? (
								<div className="detail-stats-player__stats-category player-stats">
									<PlayerStatsCategory label="Parades" value={totalSaving} />
									<PlayerStatsRow label="Coup de poing" value={player?.stats?.punch} />
									<PlayerStatsRow label="Arrêt" value={player?.stats?.catch} />
								</div>
							) : (
								<>
									<div className="detail-stats-player__stats-category player-stats">
										<PlayerStatsCategory label="Attaque" value={totalAttack} />
										<PlayerStatsRow label="Dribble" value={player?.stats?.dribble} />
										<PlayerStatsRow label="Tir" value={player?.stats?.shot} />
										<PlayerStatsRow label="Passe" value={player?.stats?.pass} />
									</div>
									<div className="detail-stats-player__stats-category player-stats">
										<PlayerStatsCategory label="Defense" value={totalDefend} />
										<PlayerStatsRow label="Tacle" value={player?.stats?.tackle} />
										<PlayerStatsRow label="Contre" value={player?.stats?.block} />
										<PlayerStatsRow label="Interception" value={player?.stats?.intercept} />
									</div>
								</>
							)
						}
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsCategory label="Physique" value={totalPhysical} />
							<PlayerStatsRow label="Rapide" value={player?.stats?.speed} />
							<PlayerStatsRow label="Puissance" value={player?.stats?.power} />
							<PlayerStatsRow label="Technique" value={player?.stats?.technique} />
						</div>
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsCategory label="Ballon flottant" />
							<PlayerStatsRow label="Ballon Haut" value={floatBallValue(player?.stats?.highBall)} />
							<PlayerStatsRow label="Ballon Bas" value={floatBallValue(player?.stats?.lowBall)} />
						</div>
					</div>
				</div>

				<div tab="Calc Stats">
					<div className="boost boost--formation">
						<div className="boost__value-list">
							{formationForm.map(input => {
								return (
									<div key={'formation_' + input.name + '_' + player.keyId} className={`boost__value-item boost__value-item--${player?.color}`}>
										{
											input.label ? (
												<>
													<label className="boost__label">{input.label}</label>
													<input
														className={`boost__input boost__input--${player?.color}`}
														defaultValue={boost[input.name]}
														placeholder={0}
														name={input.name}
														onChange={handleInputChange}
														type="number"
														autoComplete="off"
													/>
												</>
											) : null
										}

									</div>
								)
							})}
						</div>
					</div>

					<div className="boost boost--boost">
						<div className="boost__value-list">
							{boostForm.map(input => {
								return (
									<div key={'boost_' + input.name + '_' + player.keyId} className={`boost__value-item boost__value-item--${player?.color}`}>
										<label className="boost__label">{input.label}</label>
										<input
											className={`boost__input boost__input--${player?.color}`}
											defaultValue={boost[input.name]}
											placeholder={0}
											name={input.name}
											onChange={handleInputChange}
											type="number"
											autoComplete="off"
										/>
									</div>
								)
							})}
						</div>
					</div>

					<div className="boost boost--intensity">
						<div className="boost__value-list">
							{boostIntensity.map(input => {
								return (
									<div key={'boost_' + input.name + '_' + player.keyId} className={`boost__value-item boost__value-item--${player?.color}`}>
										<label className="boost__label">{input.label}</label>
										<input
											className={`boost__input boost__input--${player?.color}`}
											defaultValue={boost[input.name]}
											placeholder={0}
											name={input.name}
											onChange={handleInputChange}
											type="number"
											autoComplete="off"
										/>
									</div>
								)
							})}
						</div>
					</div>

					<div className="boost boost--limit-break">
						<div className="boost__value-list">
							{
								isGk ? (
									limitBreakGkForm.map((input, i) => {
										return (
											<div key={'lb_' + i + '_' + player.keyId} className={`boost__value-item boost__value-item--${player?.color} ${input.label ? "" : "empty"}`}>
												{
													input.label ? (
														<>
															<label className="boost__label">{input.label}</label>
															<input
																className={`boost__input boost__input--${player?.color}`}
																defaultValue={boost[input.name]}
																placeholder={0}
																name={input.name}
																onChange={handleInputChange}
																type="number"
																autoComplete="off"
															/>
														</>)
														: null
												}
											</div>
										)
									})
								) : (
									limitBreakRegularForm.map(input => {
										return (
											<div key={'lb_' + input.name + '_' + player.keyId} className={`boost__value-item boost__value-item--${player?.color}`}>
												<label>{input.label}</label>
												<input
													className={`boost__input boost__input--${player?.color}`}
													defaultValue={boost[input.name]}
													placeholder={0}
													name={input.name}
													onChange={handleInputChange}
													type="number"
													autoComplete="off"
												/>
											</div>
										)
									})
								)
							}
						</div>
					</div>

					<div className="detail-stats-player__stats">
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsRow label="Endurance" value={player?.stats?.stamina} />
						</div>
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsCategory label="Total" value={calcTotal} />
						</div>
						{
							Array.isArray(player?.positions) && player?.positions.includes("gb") ? (
								<div className="detail-stats-player__stats-category player-stats">
									<PlayerStatsCategory label="Parades" value={calcTotalSaving} />
									<PlayerStatsRow label="Coup de poing" lb={calcLbPunch} value={calcStats.punch} valueIntensity={intensity ? calcStats.punch * calcIntensity : null} goodRead={good_read ? calcStats.punch * (good_read / 100) : null} />
									<PlayerStatsRow label="Arrêt" lb={calcLbCatch} value={calcStats.catch} valueIntensity={intensity ? calcStats.catch * calcIntensity : null} goodRead={good_read ? calcStats.catch * (good_read / 100) : null} />
								</div>
							) : (
								<>
									<div className="detail-stats-player__stats-category player-stats">
										<PlayerStatsCategory label="Attaque" value={calcTotalAttack} />
										<PlayerStatsRow label="Dribble" lb={calcLbDribble} value={calcStats.dribble} valueIntensity={intensity ? calcStats.dribble * calcIntensity : null} goodRead={good_read ? calcStats.dribble * (good_read / 100) : null} />
										<PlayerStatsRow label="Tir" lb={calcLbShot} value={calcStats.shot} valueIntensity={intensity ? calcStats.shot * calcIntensity : null} goodRead={good_read ? calcStats.shot * (good_read / 100) : null} />
										<PlayerStatsRow label="Passe" lb={calcLbPass} value={calcStats.pass} valueIntensity={intensity ? calcStats.pass * calcIntensity : null} goodRead={good_read ? calcStats.pass * (good_read / 100) : null} />
									</div>
									<div className="detail-stats-player__stats-category player-stats">
										<PlayerStatsCategory label="Defense" value={calcTotalDefend} />
										<PlayerStatsRow label="Tacle" lb={calcLbTackle} value={calcStats.tackle} valueIntensity={intensity ? calcStats.tackle * calcIntensity : null} goodRead={good_read ? calcStats.tackle * (good_read / 100) : null} />
										<PlayerStatsRow label="Contre" lb={calcLbBlock} value={calcStats.block} valueIntensity={intensity ? calcStats.block * calcIntensity : null} goodRead={good_read ? calcStats.block * (good_read / 100) : null} />
										<PlayerStatsRow label="Interception" lb={calcLbIntercept} value={calcStats.intercept} valueIntensity={intensity ? calcStats.intercept * calcIntensity : null} goodRead={good_read ? calcStats.intercept * (good_read / 100) : null} />
									</div>
								</>
							)
						}
						<div className="detail-stats-player__stats-category player-stats">
							<PlayerStatsCategory label="Ballon flottant" />
							<PlayerStatsRow label="Ballon Haut" value={floatBallValue(player?.stats?.highBall)} />
							<PlayerStatsRow label="Ballon Bas" value={floatBallValue(player?.stats?.lowBall)} />
						</div>
					</div>
				</div>

				<div tab="Compétences">
					<div className="tabs_content__item tabs_content__item--overflow-hidden">
						<HiddenAbilities
							hiddenAbilities={player?.hidden_abilities_details}
							orderHiddenAbilities={player?.hidden_abilities}
							passiveSkill={player?.passive_skill_details}
							orderPassiveSkill={player?.passive_skill}
							leaderSkill={player?.leader_skill_details}
							orderLeaderSkill={player?.leader_skill}
						/>
						<TechniquesSpecials techniques={player?.techniques_details} orderTechniques={player?.techniques} />
					</div>
				</div>

				<div tab="TS">
					<AllSkills
						firstName={player?.first_name}
						lastName={player?.last_name}
						keyId={player?.keyId}
						id={player?._id}
						index={index}
						intensity={intensity}
						calcStats={calcStats}
						good_read={good_read}
					/>
				</div>
			</Tab>

			<button className="detail-stats-player__btn-delete" onClick={handleDeletePlayerOnPanel}>
				<FontAwesome
					name="times"
				/>
			</button>
		</div>
	)
}

export const PlayerStatsCategory = (props) => {
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

export const PlayerStatsRow = (props) => {
	const {
		label,
		value,
		lb,
		valueIntensity,
		goodRead
	} = props

	return (
		<div className="player-stats__row">
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
			</div>
			<div>
				{
					goodRead ? (
						<span className="player-stats__value-goodread">{Math.round(goodRead)}+</span>
					) : null
				}
				<span className="player-stats__value">{value}</span>
				{
					valueIntensity ? (
						<span className="player-stats__value-intensity">{Math.round(valueIntensity)}</span>
					) : null
				}
			</div>
		</div>
	)
}