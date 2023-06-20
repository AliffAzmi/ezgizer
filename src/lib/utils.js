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

export const convertCurrency = (currency = 'MYR', total = 0, showFigure = false) => {
	if (showFigure) {
		return new Intl.NumberFormat('ta-MY', { style: 'currency', currency: currency }).format(total)
	} else {
		return (0)
			.toLocaleString('ta-MY', {
				style: 'currency',
				currency,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			})
			.replace(/\d/g, '')
			.trim()
	}
}
