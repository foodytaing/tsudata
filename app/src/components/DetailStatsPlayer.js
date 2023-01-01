import React, { useState } from "react";
import FontAwesome from 'react-fontawesome'

import { useDispatch, useSelector } from "react-redux";
import useSWR from 'swr'
import axios from "axios";
import { ADD_PLAYER_ON_PANEL } from "../actions/player.action"

import Tab from "../components/Tab"

import HiddenAbilities from "./HiddenAbilities";
import TechniquesSpecials from "./TechniquesSpecials";
import AllSkills from "./AllSkills";

import "./detailStatsPlayer.scss";
import loader from "../img/loader.gif"

import { fetcher, floatBallValue, lbCalculator, totalLb, boudaryBreakBonus, displayBoudaryBreakBonus, boundaryBreakStamina } from "../utils/calculator";
import PlayerStatsCategoryRow from "./statsRow/PlayerStatsCategoryRow";
import PlayerStatsRow from "./statsRow/PlayerStatsRow";
import PlayerStatsSkillRow from "./statsRow/PlayerStatsSkillRow";

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
	{ name: "leader_skill", label: "Leader Skill (%)" },
	{ name: "bond", label: "Bond (%)" }
]
const boostIntensity = [
	{ name: "params", label: "Params (%)" },
	{ name: "intensity", label: "Intensité (%)" },
	{ name: "good_read", label: "Bonne lecture (%)" }
]
const boundaryBreak = [
	{ name: "boundary_break", label: "Explosion", type: "select" }
]
const orderPosition = ['at', 'mo', 'md', 'df', 'gb'];

export const DetailStatsPlayer = (props) => {
	const {
		player,
		handleDeletePlayerOnPanel,
		index
	} = props

	const [boost, setBoost] = useState({
		leader_skill: 75, params: "", bond: 55, intensity: "", good_read: "",
		dribble: 25, shot: 25, pass: 25, tackle: 25, block: 25, intercept: 25, speed: 25, power: 25, technique: 25, catch: 25, punch: 25,
		attack: "", defend: "", physical: "10", saving: "", stamina: "",
		active_skills_boost: {
			params_block: 0,
			params_catch: 0,
			params_dribble: 0,
			params_intercept: 0,
			params_pass: 0,
			params_power: 0,
			params_punch: 0,
			params_shot: 0,
			params_speed: 0,
			params_tackle: 0,
			params_technique: 0,
			intensity_catch: 0,
			intensity_dribble: 0,
			intensity_intercept: 0,
			intensity_pass: 0,
			intensity_power: 0,
			intensity_punch: 0,
			intensity_shot: 0,
			intensity_speed: 0,
			intensity_tackle: 0,
			intensity_technique: 0,
			good_read_catch: 0,
			good_read_dribble: 0,
			good_read_intercept: 0,
			good_read_pass: 0,
			good_read_power: 0,
			good_read_punch: 0,
			good_read_shot: 0,
			good_read_speed: 0,
			good_read_tackle: 0,
			good_read_technique: 0,
		}, active_skills: {}, boundary_break: 4
	})

	const [moveset, setMoveset] = useState({});
	const [allTech, setAllTech] = useState([]);

	const setSkillBoost = (skill) => {
		const defaultAssignmentStats = skill.assignment_stats.length === 0 ?
			["dribble",
				"shot",
				"pass",
				"tackle",
				"block",
				"intercept",
				"speed",
				"power",
				"technique",
				"punch",
				"catch",
				"highball",
				"lowball"]
			: skill.assignment_stats

		const active_skills = { ...boost.active_skills }
		const active_skills_boost = { ...boost.active_skills_boost }

		if (active_skills[skill._id] == undefined || active_skills[skill._id] == false) {
			active_skills[skill._id] = true;

			defaultAssignmentStats.forEach(stats => {
				active_skills_boost[skill.effect_type + '_' + stats] = (active_skills_boost[skill.effect_type + '_' + stats] || 0) + skill.effect_value;
			})

		} else {
			active_skills[skill._id] = false;

			defaultAssignmentStats.forEach(stats => {
				active_skills_boost[skill.effect_type + '_' + stats] = active_skills_boost[skill.effect_type + '_' + stats] - skill.effect_value;
			})
		}

		setBoost({ ...boost, active_skills, active_skills_boost });
	}

	const handleSetMoveset = (tech) => {
		const newMoveset = { ...moveset }

		if (newMoveset[tech.type_technique]._id === tech._id) {
			newMoveset[tech.type_technique] = {}
		} else {
			newMoveset[tech.type_technique] = tech
		}

		setMoveset({ ...newMoveset });
	}

	const dispatch = useDispatch();
	const playersOnPanel = useSelector((state) => state.playerReducer);

	const currentPlayer = playersOnPanel[index];
	const allReadyFetch = (Array.isArray(currentPlayer?.allTechniques) && currentPlayer?.allTechniques.length) || 0;

	const [loading, setLoading] = useState(true);

	const { data, error } = useSWR(`${process.env.REACT_APP_API_URL}/api/player?last_name=${player.last_name}&first_name=${player.first_name}`, fetcher)

	let techniques = [];
	let allTechniques = [];
	let skills = {};

	if (allReadyFetch === 0) {
		Array.isArray(data) && data.forEach((el, index) => {
			el.techniques.forEach((id, index) => techniques.push({ id: id, image_url: el.image_url, chest: el.chest, index: index }))

			if (data.length === (index + 1)) {
				techniques.forEach((tech, i) => {
					axios
						.get(`${process.env.REACT_APP_API_URL}/api/technique/${tech.id}`)
						.then((res) => {
							allTechniques.push({ ...res.data, image_url: tech.image_url, chest: tech.chest, index: tech.index });

							if (techniques.length === allTechniques.length) {
								let newPlayersOnPanel = [...playersOnPanel]

								skills = {
									dribble: {
										label: "Dribble",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "dribble" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									shot: {
										label: "Tir",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "shot" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									pass: {
										label: "Passe",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "pass" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									onetwo: {
										label: "Une Deux",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "onetwo" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									tackle: {
										label: "Tacle",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "tackle" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									block: {
										label: "Contre",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "block" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									intercept: {
										label: "Interception",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "intercept" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									highball: {
										label: "Ballon Haut",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "highball" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									lowball: {
										label: "Ballon Bas",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "lowball" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									punch: {
										label: "Coup de poing",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "punch" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									},
									catch: {
										label: "Arrêt",
										data: Array.isArray(allTechniques) && allTechniques.filter(data => data.type_technique === "catch" && data.rank === "s").sort(function (a, b) { return b.intensity - a.intensity })
									}
								}

								setMoveset({
									dribble: skills?.dribble?.data[0],
									shot: skills?.shot?.data[0],
									pass: skills?.pass?.data[0],
									onetwo: skills?.onetwo?.data[0],
									tackle: skills?.tackle?.data[0],
									block: skills?.block?.data[0],
									intercept: skills?.intercept?.data[0],
									highball: skills?.highball?.data[0],
									lowball: skills?.lowball?.data[0],
									punch: skills?.punch?.data[0],
									catch: skills?.catch?.data[0]
								})

								newPlayersOnPanel.forEach((newPlayer, index) => {
									if (newPlayer.keyId == player?.keyId) {
										newPlayersOnPanel[index].allTechniques = allTechniques
										setLoading(false);
										setAllTech(allTechniques);
									}
								})
							}

						}).catch((err) => console.log(err))
				})
			}
		})
	}

	console.log(moveset);

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
	const boundary_break = parseInt(boost.boundary_break) || 0;

	const skills_boost_params_dribble = parseInt(boost.active_skills_boost.params_dribble) || 0;
	const skills_boost_params_shot = parseInt(boost.active_skills_boost.params_shot) || 0;
	const skills_boost_params_pass = parseInt(boost.active_skills_boost.params_pass) || 0;
	const skills_boost_params_tackle = parseInt(boost.active_skills_boost.params_tackle) || 0;
	const skills_boost_params_block = parseInt(boost.active_skills_boost.params_block) || 0;
	const skills_boost_params_intercept = parseInt(boost.active_skills_boost.params_intercept) || 0;
	const skills_boost_params_speed = parseInt(boost.active_skills_boost.params_speed) || 0;
	const skills_boost_params_power = parseInt(boost.active_skills_boost.params_power) || 0;
	const skills_boost_params_technique = parseInt(boost.active_skills_boost.params_technique) || 0;
	const skills_boost_params_catch = parseInt(boost.active_skills_boost.params_catch) || 0;
	const skills_boost_params_punch = parseInt(boost.active_skills_boost.params_punch) || 0;

	const skills_boost_intensity_dribble = parseInt(boost.active_skills_boost.intensity_dribble) || 0;
	const skills_boost_intensity_shot = parseInt(boost.active_skills_boost.intensity_shot) || 0;
	const skills_boost_intensity_pass = parseInt(boost.active_skills_boost.intensity_pass) || 0;
	const skills_boost_intensity_tackle = parseInt(boost.active_skills_boost.intensity_tackle) || 0;
	const skills_boost_intensity_block = parseInt(boost.active_skills_boost.intensity_block) || 0;
	const skills_boost_intensity_intercept = parseInt(boost.active_skills_boost.intensity_intercept) || 0;
	const skills_boost_intensity_catch = parseInt(boost.active_skills_boost.intensity_catch) || 0;
	const skills_boost_intensity_punch = parseInt(boost.active_skills_boost.intensity_punch) || 0;
	const skills_boost_intensity_lowball = parseInt(boost.active_skills_boost.intensity_lowball) || 0;
	const skills_boost_intensity_highball = parseInt(boost.active_skills_boost.intensity_highball) || 0;


	const calcLb = () => {
		let physical = lbSpeed + lbPower + lbTechnique

		if (isGk) {
			return lbSavingCatch + lbSavingPunch + physical
		} else {
			return lbDribble + lbShot + lbPass + lbTackle + lbBlock + lbIntercept + physical
		}
	}

	const saving = parseInt(boost.defend) || 0;
	const stamina = (parseInt(player?.stats?.stamina) + boundaryBreakStamina(boundary_break)) || 0;

	const stats = {
		dribble: parseInt(player?.stats?.dribble) + boudaryBreakBonus("attack", boundary_break) || 0,
		shot: parseInt(player?.stats?.shot) + boudaryBreakBonus("attack", boundary_break) || 0,
		pass: parseInt(player?.stats?.pass) + boudaryBreakBonus("attack", boundary_break) || 0,
		tackle: parseInt(player?.stats?.tackle) + boudaryBreakBonus("defense", boundary_break) || 0,
		block: parseInt(player?.stats?.block) + boudaryBreakBonus("defense", boundary_break) || 0,
		intercept: parseInt(player?.stats?.intercept) + boudaryBreakBonus("defense", boundary_break) || 0,
		speed: parseInt(player?.stats?.speed) + boudaryBreakBonus("physical", boundary_break) || 0,
		power: parseInt(player?.stats?.power) + boudaryBreakBonus("physical", boundary_break) || 0,
		technique: parseInt(player?.stats?.technique) + boudaryBreakBonus("physical", boundary_break) || 0,
		catch: parseInt(player?.stats?.catch) + boudaryBreakBonus("saving", boundary_break) || 0,
		punch: parseInt(player?.stats?.punch) + boudaryBreakBonus("saving", boundary_break) || 0
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
		dribble: (Math.round((calcDribble) * ((params + bond + skills_boost_params_dribble) / 100 + 1 || 1))) + (Math.round((calcSpeed / 2) * ((params + bond + skills_boost_params_speed) / 100 + 1 || 1))),
		shot: (Math.round((calcShot) * ((params + bond + skills_boost_params_shot) / 100 + 1 || 1))) + (Math.round((calcPower / 2) * ((params + bond + skills_boost_params_power) / 100 + 1 || 1))),
		pass: (Math.round((calcPass) * ((params + bond + skills_boost_params_pass) / 100 + 1 || 1))) + (Math.round((calcTechnique / 2) * ((params + bond + skills_boost_params_technique) / 100 + 1 || 1))),
		tackle: (Math.round((calcTackle) * ((params + bond + skills_boost_params_tackle) / 100 + 1 || 1))) + (Math.round((calcSpeed / 2) * ((params + bond + skills_boost_params_speed) / 100 + 1 || 1))),
		block: (Math.round((calcBlock) * ((params + bond + skills_boost_params_block) / 100 + 1 || 1))) + (Math.round((calcPower / 2) * ((params + bond + skills_boost_params_power) / 100 + 1 || 1))),
		intercept: (Math.round((calcIntercept) * ((params + bond + skills_boost_params_intercept) / 100 + 1 || 1))) + (Math.round((calcTechnique / 2) * ((params + bond + skills_boost_params_technique) / 100 + 1 || 1))),
		punch: (Math.round((calcSavingPunch) * ((params + bond + skills_boost_params_punch) / 100 + 1 || 1))) + (Math.round(((calcPower) / 4) * ((params + bond + skills_boost_params_power) / 100 + 1 || 1))) + (Math.round(((calcSpeed) / 4) * ((params + bond + skills_boost_params_speed) / 100 + 1 || 1))),
		catch: (Math.round((calcSavingCatch) * ((params + bond + skills_boost_params_catch) / 100 + 1 || 1))) + (Math.round(((calcPower) / 4) * ((params + bond + skills_boost_params_power) / 100 + 1 || 1))) + (Math.round(((calcTechnique) / 4) * ((params + bond + skills_boost_params_technique) / 100 + 1 || 1))),
		highball: player?.stats?.highBall,
		lowball: player?.stats?.lowBall
	}

	const calcIntensity = intensity

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
			<div className="detail-stats-player__id">{player?._id}</div>

			<div className="detail-stats-player__img-wrapper">
				<h3 className={`detail-stats-player__full-name text-color--${player?.color}`}>
					<span className={`detail-stats-player__flag flag flag--${player?.country && player?.country.toLowerCase()}`} />
					{player?.last_name} {player?.first_name} {player.chest == "true" ? <FontAwesome name="gift" /> : null}
					<span className="detail-stats-player__sub-name">
						{player?.sub_name}
					</span>
					<span className={`detail-stats-player__series`}>
						{player?.series}
					</span>
				</h3>
				<img
					className="detail-stats-player__img"
					src={player?.image_url ? `https://res.cloudinary.com/dcty4rvff/image/upload/c_scale,w_300/${player?.image_url.path}` : "https://pleinjour.fr/wp-content/plugins/lightbox/images/No-image-found.jpg"}
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

			{loading && allReadyFetch === 0 ? (
				<img src={loader} className="loader" />
			) : (
				<Tab defaultIndex={1}>
					<div tab="Stats">
						<div className="detail-stats-player__stats">
							<div className="detail-stats-player__stats-category player-stats">
								<PlayerStatsRow label="Endurance" value={player?.stats?.stamina} />
							</div>
							<div className="detail-stats-player__stats-category player-stats">
								<PlayerStatsCategoryRow label="Total" value={total} />
							</div>
							{
								isGk ? (
									<div className="detail-stats-player__stats-category player-stats">
										<PlayerStatsCategoryRow label="Parades" value={totalSaving} />
										<div className="player-stats__row-wrapper">
											<PlayerStatsRow label="Coup de poing" value={player?.stats?.punch} />
										</div>
										<div className="player-stats__row-wrapper">
											<PlayerStatsRow label="Arrêt" value={player?.stats?.catch} />
										</div>
									</div>
								) : (
									<>
										<div className="detail-stats-player__stats-category player-stats">
											<PlayerStatsCategoryRow label="Attaque" value={totalAttack} />
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow label="Dribble" value={player?.stats?.dribble} />
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow label="Tir" value={player?.stats?.shot} />
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow label="Passe" value={player?.stats?.pass} />
											</div>
										</div>
										<div className="detail-stats-player__stats-category player-stats">
											<PlayerStatsCategoryRow label="Defense" value={totalDefend} />
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow label="Tacle" value={player?.stats?.tackle} />
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow label="Contre" value={player?.stats?.block} />
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow label="Interception" value={player?.stats?.intercept} />
											</div>
										</div>
									</>
								)
							}
							<div className="detail-stats-player__stats-category player-stats">
								<PlayerStatsCategoryRow label="Physique" value={totalPhysical} />
								<div className="player-stats__row-wrapper">
									<PlayerStatsRow label="Rapide" value={player?.stats?.speed} />
								</div>
								<div className="player-stats__row-wrapper">
									<PlayerStatsRow label="Puissance" value={player?.stats?.power} />
								</div>
								<div className="player-stats__row-wrapper">
									<PlayerStatsRow label="Technique" value={player?.stats?.technique} />
								</div>
							</div>
							<div className="detail-stats-player__stats-category player-stats">
								<PlayerStatsCategoryRow label="Ballon flottant" />
								<PlayerStatsRow label="Ballon Haut" value={floatBallValue(player?.stats?.highBall)} />
								<PlayerStatsRow label="Ballon Bas" value={floatBallValue(player?.stats?.lowBall)} />
							</div>
						</div>
					</div>

					<div tab="Stats en Match">
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
												type={"number"}
												autoComplete="off"
											/>
										</div>
									)
								})}
								{boundaryBreak.map(input => {
									return (
										<div key={'boost_' + input.name + '_' + player.keyId} className={`boost__value-item boost__value-item--${player?.color}`}>
											<label className="boost__label">{input.label} - {calcLb()}</label>
											<div style={{ display: 'none' }}>({calcLb()}/{totalLb(boundary_break, isGk)})</div>
											<select
												className={`boost__input boost__input--${player?.color}`}
												defaultValue={boost[input.name]}
												placeholder={0}
												name={input.name}
												onChange={handleInputChange}
												type={"number"}
												autoComplete="off"
											>
												<option value="0">0</option>
												<option value="1">1</option>
												<option value="2">2</option>
												<option value="3">3</option>
												<option value="4">4</option>
											</select>
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
								<PlayerStatsRow label="Endurance" value={stamina} bb={boundaryBreakStamina(boundary_break)} />
							</div>
							<div className="detail-stats-player__stats-category player-stats">
								<PlayerStatsCategoryRow label="Total" value={calcTotal} />
							</div>
							{
								Array.isArray(player?.positions) && player?.positions.includes("gb") ? (
									<div className="detail-stats-player__stats-category player-stats">
										<PlayerStatsCategoryRow label="Parades" value={calcTotalSaving} />
										<div className="player-stats__row-wrapper">
											<PlayerStatsRow
												label="Coup de poing"
												lb={calcLbPunch}
												bb={displayBoudaryBreakBonus(boundary_break)}
												value={calcStats.punch}
												skillsBoostIntensity={boost?.active_skills_boost?.intensity_punch + intensity}
												skillsBoostParams={boost?.active_skills_boost?.params_punch + params}
												skillsBoostParamsPhy={boost?.active_skills_boost?.params_power + params}
												skillsBoostParamsPhytwo={boost?.active_skills_boost?.params_speed + params}
												skillsBoostGoodRead={boost?.active_skills_boost?.good_read_punch + good_read}
											/>
											<PlayerStatsSkillRow
												skill={moveset.punch}
												type="punch"
												stats={calcStats}
												calcIntensity={calcIntensity + skills_boost_intensity_punch}
												boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_punch) / 100}
											/>
										</div>
										<div className="player-stats__row-wrapper">
											<PlayerStatsRow
												label="Arrêt"
												lb={calcLbCatch}
												bb={displayBoudaryBreakBonus(boundary_break)}
												value={calcStats.catch}
												skillsBoostIntensity={boost?.active_skills_boost?.intensity_catch + intensity}
												skillsBoostParams={boost?.active_skills_boost?.params_catch + params}
												skillsBoostParamsPhy={boost?.active_skills_boost?.params_power + params}
												skillsBoostParamsPhytwo={boost?.active_skills_boost?.params_technique + params}
												skillsBoostGoodRead={boost?.active_skills_boost?.good_read_catch + good_read}
											/>
											<PlayerStatsSkillRow
												skill={moveset.catch}
												type="catch"
												stats={calcStats}
												calcIntensity={calcIntensity + skills_boost_intensity_catch}
												boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_catch) / 100} />
										</div>
									</div>
								) : (
									<>
										<div className="detail-stats-player__stats-category player-stats">
											<PlayerStatsCategoryRow label="Attaque" value={calcTotalAttack} />
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Dribble"
													lb={calcLbDribble}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.dribble}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_dribble + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_dribble + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_speed + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_dribble + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.dribble}
													type="dribble"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_dribble}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_dribble) / 100}
												/>
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Tir"
													lb={calcLbShot}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.shot}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_shot + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_shot + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_power + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_shot + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.shot}
													type="shot"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_shot}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_shot) / 100}
												/>
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Passe"
													lb={calcLbPass}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.pass}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_pass + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_pass + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_technique + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_pass + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.pass}
													type="pass"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_pass}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_pass) / 100}
												/>
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Une-Deux"
													lb={calcLbPass}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.pass}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_pass + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_pass + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_technique + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_pass + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.onetwo}
													type="onetwo"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_pass}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_pass) / 100}
												/>
											</div>
										</div>
										<div className="detail-stats-player__stats-category player-stats">
											<PlayerStatsCategoryRow label="Defense" value={calcTotalDefend} />
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Tacle" lb={calcLbTackle}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.tackle}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_tackle + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_tackle + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_speed + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_tackle + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.tackle}
													type="tackle"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_tackle}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_tackle) / 100}
												/>
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Contre"
													lb={calcLbBlock}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.block}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_block + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_block + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_power + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_block + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.block}
													type="block"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_block}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_block) / 100}
												/>
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Interception"
													lb={calcLbIntercept}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.intercept}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_intercept + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_intercept + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_technique + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_intercept + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.intercept}
													type="intercept"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_intercept}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_intercept) / 100}
												/>
											</div>
										</div>
										<div className="detail-stats-player__stats-category player-stats">
											<PlayerStatsCategoryRow label="Ballon flottant" />
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Ballon Haut"
													lb={calcLbShot}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.shot}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_highball + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_shot + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_power + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_highball + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.highball}
													type="highball"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_highball}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_highball) / 100}
												/>
											</div>
											<div className="player-stats__row-wrapper">
												<PlayerStatsRow
													label="Ballon Bas"
													lb={calcLbShot}
													bb={displayBoudaryBreakBonus(boundary_break)}
													value={calcStats.shot}
													skillsBoostIntensity={boost?.active_skills_boost?.intensity_lowball + intensity}
													skillsBoostParams={boost?.active_skills_boost?.params_shot + params}
													skillsBoostParamsPhy={boost?.active_skills_boost?.params_power + params}
													skillsBoostGoodRead={boost?.active_skills_boost?.good_read_lowball + good_read}
												/>
												<PlayerStatsSkillRow
													skill={moveset.lowball}
													type="lowball"
													stats={calcStats}
													calcIntensity={calcIntensity + skills_boost_intensity_lowball}
													boostGoodRead={(good_read + boost?.active_skills_boost?.good_read_lowball) / 100}
												/>
											</div>
										</div>
									</>
								)
							}
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
								setSkillBoost={setSkillBoost}
								active_skills={boost.active_skills}
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
							active_skills_boost={boost.active_skills_boost}
							moveset={moveset}
							handleSetMoveset={handleSetMoveset}
							allTechniques={allTech}
						/>
					</div>
				</Tab>)}

			<button className="detail-stats-player__btn-delete" onClick={handleDeletePlayerOnPanel}>
				<FontAwesome
					name="times"
				/>
			</button>
		</div>
	)
}
