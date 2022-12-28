/**Map input value to output range. 
 * 
 *      map(5, 0, 10, 0, 100);
 *      Original number is 5, it has a range 0...10
 *      Output has range 0...1000
 *         -> outputs 50
 * @returns {number}*/
function map(number, inMin, inMax, outMin, outMax) {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const is_key_down = (() => {
    const state = {};

    for (press of ["w", "s", "a", "d"]) {
        window.addEventListener('keyup', (press) => state[press.key] = false);
        window.addEventListener('keydown', (press) => state[press.key] = true);
    }

    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();