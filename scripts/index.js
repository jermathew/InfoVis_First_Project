// BIG TODO: REFACTOR THIS CODE

// svg items ids
const CHRISTMAS_ITEMS = ["pine", 
"top-left-circle", 
"top-right-circle",
"center-left-circle",
"center-right-circle",
"bottom-left-circle",
"bottom-right-circle"
];

let idToKey = {};

d3.json("data/small-data.json")
.then(
	function(data){
		dataKeys = Object.keys(data[0])
		console.table(data);
		CHRISTMAS_ITEMS.slice(1).forEach((key, idx) => idToKey[key] = dataKeys[idx]);
		drawPlot(data);
	}
	);
	
	function drawPlot(dataset){
		
		// onclick event listener function
		function triggerSort(){
			let selectedCircle = d3.select(this)
			let circleClass = selectedCircle.attr("class")
			let sortKey = idToKey[circleClass]
			sortBars(sortKey);
		}
		
		function sortBars(key) {
			let svg = d3.select("svg");
			let sortedTrees = svg.selectAll("g.christmas-tree")
			.sort(function(a, b) {
				return d3.ascending(a[key], b[key]);
			});

			CHRISTMAS_ITEMS.forEach(function(svgID){
				sortedTrees.select("use." + svgID)
				.transition()
				.delay(function(d, i) {
					return i * 50;
				})
				.duration(1000)
				.attr("x", function(d, i) {
					return xScale(i);
				});
			})
		};
		
		var xScale = d3.scaleBand()
		.domain(d3.range(dataset.length))
		.rangeRound([0, 1250]) // edit this line
		.paddingInner(0.1);
		
		//Select SVG element
		let svg = d3.select("svg");
		
		//Create christmas trees placeholders
		let christmasTrees = svg.selectAll("g.christmas-tree")
		.data(dataset)
		.enter()
		.append("g")
		.classed("christmas-tree", true)
		.attr("pointer-events", "none");
		
		CHRISTMAS_ITEMS.forEach(function(svgID){
			let item = christmasTrees.append("use")
			.attr("href", "images/christmas-tree.svg#" + svgID)
			.classed(svgID, true)
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("width", xScale.bandwidth())
			.attr("pointer-events", "auto");
			
			if(svgID !== "pine"){
				item.on("click", triggerSort)
				.append("title") .text(function(d) {
					let key = idToKey[svgID];
					return "This value is " +  d[key]});
				}
				
			})
		}