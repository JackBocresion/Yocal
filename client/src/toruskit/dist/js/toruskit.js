(function() {
	var TORUS = TORUS || {};

	/**
	 * Chrome range progress
	 */
	TORUS.webkitRangeProgress = function(selector) {
		let range;
		let countRange = function(element) {
			let min = element.min || 0;
			let max = element.max || 100;
			range = ((element.value - min) / (max - min)) * 100;
			element.style.setProperty("--range", range + "%");
		}

		Array.from(document.querySelectorAll(selector), function(element) {
			countRange(element);
			element.addEventListener("input", function(e) {
				countRange(e.target);
			}, false);
		});
	};
	TORUS.webkitRangeProgress(".custom-range-progress");

	/**
	 * Custom number input counter
	 */
	(function() {
		Array.from(document.querySelectorAll(".btn-custom-number-up"), element => {
			element.addEventListener("click", () => {
				const input = document.querySelector(element.getAttribute("target"));
				input.stepUp();
			})
		});

		Array.from(document.querySelectorAll(".btn-custom-number-down"), element => {
			element.addEventListener("click", () => {
				const input = document.querySelector(element.getAttribute("target"));
				input.stepDown();
			})
		});
  }());

}());