import lbVal from "../data/limit_break_values.json"

export const fetcher = url => fetch(url).then(r => r.json())

export const calcStatTechnique = ({ intensity, type, stats, colorAdvantage, goodRead, boostGoodRead }) => {
  let value;
  let typeTech = type === "onetwo" ? "pass" : type;

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
    case 'onetwo':
      value = Math.round(parseInt(intensity / 100 * parseInt(stats[typeTech])))
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

  let calcGoodRead = stats[typeTech] * (boostGoodRead) || 0

  if (goodRead) {
    return Math.trunc((calcGoodRead + value + stats[typeTech]) / 1000);
  } else {
    return Math.trunc((calcGoodRead + value) / 1000);
  }
};

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

export const totalLb = (boundary_break, isGk) => {
  if (isGk) {
    if (boundary_break == 1) {
      return 90;
    } else if (boundary_break == 2) {
      return 105;
    } else if (boundary_break == 3) {
      return 120;
    } else if (boundary_break == 4) {
      return 125;
    } else {
      return 75;
    }
  } else {
    if (boundary_break == 1) {
      return 125;
    } else if (boundary_break == 2) {
      return 150;
    } else if (boundary_break == 3) {
      return 175;
    } else if (boundary_break == 4) {
      return 200;
    } else {
      return 100;
    }
  }
}

export const boudaryBreakBonus = (typeStats, boundary_break) => {
  if (boundary_break == 2 && typeStats == "physical") {
    return 1200;
  } else if (boundary_break >= 3 && typeStats == "physical") {
    return 2400;
  } else if (boundary_break == 4 && (typeStats == "attack" || typeStats == "defense" || typeStats == "saving")) {
    return 1200;
  } else {
    return 0;
  }
}

export const displayBoudaryBreakBonus = (boundary_break) => {
  if (boundary_break == 1) {
    return 0;
  } else if (boundary_break == 2) {
    return 600;
  } else if (boundary_break == 3) {
    return 1200;
  } else if (boundary_break == 4) {
    return 2400;
  } else {
    return 0;
  }
}

export const boundaryBreakStamina = (boundary_break) => {
  if (boundary_break >= 1) {
    return 100;
  } else {
    return 0;
  }
}