import React from "react";
import FontAwesome from 'react-fontawesome'

import "./techniquesSpecials.scss";

export const TechniquesSpecials = (props) => {
	const {
		orderTechniques,
		techniques
	} = props

	orderTechniques.reverse();

	return (
		<div className="technique">
			<span className="technique__title">Techniques spéciales</span>
			<ul className="technique__list">
				{orderTechniques.map(id => {
					const technique = techniques[id];

					return (
						<li className="technique__item" key={technique._id}>
							<div>
								<div>
									<span className="technique__rank">{technique.rank}</span> - <span className="technique__type">{technique.type_technique}</span>
								</div>

								<div>
									<span className="technique__intensity">
										<FontAwesome
											name="fire"
										/>
										{technique.intensity}
									</span>

									<span className="technique__stamina">
										<FontAwesome
											name="bolt"
										/>
										{technique.stamina}
									</span>
								</div>
							</div>

							<span className="technique__name">{technique.name}</span>
						</li>
					)
				})}
			</ul>
		</div>
	);
};

export default TechniquesSpecials;