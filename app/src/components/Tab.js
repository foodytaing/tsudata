import React, { useState } from "react";

import "./tab.scss";

export const Tabs = (props) => {
	const { defaultIndex = 0, children = [], className = "" } = props;

	const [TabIndex, SetTabIndex] = useState(defaultIndex);

	if (!Array.isArray(children) || !children) {
		return null;
	}

	const tabsMenu = children.map((item) => ({
		label: item.props.tab,
		className: item.props.className,
	}));

	return (
		<div className={`tabs ${className}`}>
			<ul className={`tabs__menu ${className}`}>
				{tabsMenu.map((item, index) => {
					const activeClassName =
						index === TabIndex ? "tabs__menu-item--active" : "";

					if (!item.label) {
						return null;
					}

					return (
						<li
							className={`tabs__menu-item ${className} ${item.className} ${activeClassName}`}
							key={index}
							onClick={() => SetTabIndex(index)}
						>
							{item.label}
						</li>
					);
				})}
			</ul>
			<div className={`tabs__content ${className}`}>{children[TabIndex]}</div>
		</div>
	);
};

export default Tabs;