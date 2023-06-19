export const getDiffPercentage = (a, b) => {
	return (a / b) * 100
}

export const clickOutside = node => {
	const handleClick = event => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node))
		}
	}
	document.addEventListener('click', handleClick, true)
	return {
		destroy () {
			document.removeEventListener('click', handleClick, true)
		}
	}
}
