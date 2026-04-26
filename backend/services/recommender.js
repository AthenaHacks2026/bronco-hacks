function getChildAgeMonths(user) {
	const onboarding = user.onboarding || {};
  
	const childAgeValue = Number(onboarding.childAgeValue || 0);
	const childAgeUnit = onboarding.childAgeUnit || "";
  
	if (!childAgeValue) return null;
  
	if (childAgeUnit === "months") return childAgeValue;
	if (childAgeUnit === "weeks") return Math.max(0, Math.round(childAgeValue / 4));
	if (childAgeUnit === "years") return childAgeValue * 12;
  
	return null;
  }
  
  function getUserStage(user) {
	const onboarding = user.onboarding || {};
  
	const pregnantWeeks = Number(onboarding.pregnantWeeks || 0);
	const postpartumWeeks = Number(onboarding.postpartumWeeks || 0);
	const childAgeMonths = getChildAgeMonths(user);
  
	if (pregnantWeeks > 0) {
	  return {
		type: "pregnant",
		referenceAgeMonths: 0
	  };
	}
  
	if (postpartumWeeks > 0) {
	  return {
		type: "postpartum",
		referenceAgeMonths: Math.max(0, Math.round(postpartumWeeks / 4))
	  };
	}
  
	if (childAgeMonths !== null) {
	  return {
		type: "child-age-known",
		referenceAgeMonths: childAgeMonths
	  };
	}
  
	return {
	  type: "unknown",
	  referenceAgeMonths: null
	};
  }
  
  function itemFitsStage(user, item) {
	const { referenceAgeMonths } = getUserStage(user);
  
	if (referenceAgeMonths === null) return false;
  
	return (
	  referenceAgeMonths >= item.minAgeMonths &&
	  referenceAgeMonths <= item.maxAgeMonths
	);
  }
  
  function getAgeFitReason(user, item) {
	const { referenceAgeMonths } = getUserStage(user);
  
	if (referenceAgeMonths === null) {
	  return null;
	}
  
	if (referenceAgeMonths < item.minAgeMonths) {
	  return "better for an older child";
	}
  
	if (referenceAgeMonths > item.maxAgeMonths) {
	  return "better for a younger child";
	}
  
	return `good fit for about ${referenceAgeMonths} months`;
  }
  
  function scoreItemForUser(user, item) {
	const onboarding = user.onboarding || {};
	const needTags = onboarding.needTags || [];
  
	let score = 0;
	const reasons = [];
  
	// Strongest signal: user explicitly selected this need
	if (needTags.includes(item.category)) {
	  score += 5;
	  reasons.push(`matches your selected need: ${item.category}`);
	}
  
	// Strong signal: age/stage fit
	if (itemFitsStage(user, item)) {
	  score += 4;
	  const ageReason = getAgeFitReason(user, item);
	  if (ageReason) reasons.push(ageReason);
	} else {
	  score -= 3;
	  const ageReason = getAgeFitReason(user, item);
	  if (ageReason) reasons.push(ageReason);
	}
  
	// Smaller signals
	if (item.condition === "new") {
	  score += 1;
	  reasons.push("new condition");
	} else if (item.condition === "used-good") {
	  score += 0.5;
	  reasons.push("good condition");
	}
  
	if (item.location === "nearby") {
	  score += 1;
	  reasons.push("available nearby");
	}
  
	return {
	  ...item,
	  score,
	  reasons
	};
  }
  
  function getRecommendations(user, items) {
	const scored = items
	  .map((item) => scoreItemForUser(user, item))
	  .sort((a, b) => b.score - a.score);
  
	const strongMatches = scored.filter((item) => item.score >= 3).slice(0, 6);
  
	if (strongMatches.length > 0) {
	  return strongMatches;
	}
  
	return scored.slice(0, 3);
  }
  
  module.exports = {
	getChildAgeMonths,
	getUserStage,
	itemFitsStage,
	scoreItemForUser,
	getRecommendations
  };