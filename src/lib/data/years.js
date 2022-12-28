const y = () => {
	var max = new Date().getFullYear()+1
	var min = max - 9
	var years = []

	for (var i = max; i >= min; i--) {
		years.push(i)
	}
	return years
}
export let years = y()
