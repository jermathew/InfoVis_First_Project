// svg items ids
const CHRISTMAS_ITEMS = ["pine", 
"top-left-circle", 
"top-right-circle",
"center-left-circle",
"center-right-circle",
"bottom-left-circle",
"bottom-right-circle"
];

const CHRISTMAS_BALLS = CHRISTMAS_ITEMS.slice(1);

// side padding (percent)
const HORIZONTAL_PADDING = 0.01

// viewport width and height
let pageWidth = window.innerWidth
let pageHeight = window.innerHeight

// svg id to dataset field
let idToKey = {};


// onclick event listener function
function triggerSort(xScale){
	let selectedCircle = d3.select(this)
	let circleClass = selectedCircle.attr("class")
	let sortKey = idToKey[circleClass]
	sortBars(sortKey, xScale);
}


function sortBars(key, xScale) {
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


function drawPlot(dataset){

	let xScale = d3.scaleBand()
					.domain(d3.range(dataset.length))
					.rangeRound([pageWidth * HORIZONTAL_PADDING, pageWidth - (pageWidth * HORIZONTAL_PADDING)])
					.paddingInner(0.1);

	let ballColors =  d3.scaleOrdinal()
						.domain(CHRISTMAS_BALLS)
						.range(d3.schemeAccent);

	// map each field value to a sequential color scale
	let colorScales = {}

	CHRISTMAS_BALLS.forEach(function(svgID){
		let color = ballColors(svgID);
		let datasetField = idToKey[svgID];
		let minValue = 0
		let maxValue = d3.max(dataset, function(d){
			return d[datasetField];
		});

		let colorSequentialScale = d3.scaleLinear()
									 .domain([minValue, maxValue])
		  							 .range(["white", color]);
		
		colorScales[svgID] = colorSequentialScale;
	})
		
	//Select SVG element
	let svg = d3.select("body")
				.append("svg")
				.attr("width", pageWidth)
                .attr("height", pageHeight);
	
	//Create christmas trees placeholders
	let christmasTrees = svg.selectAll("g.christmas-tree")
							.data(dataset)
							.enter()
							.append("g")
							.classed("christmas-tree", true)
							.attr("pointer-events", "none");
	
	// put a pine and six christmas balls for each placeholder 
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
			item.on("click", function(){
				triggerSort.call(this, xScale)
				})
				.style("fill", function(d,i){
					let key = idToKey[svgID];
					let value = d[key];
					let scaleFunction = colorScales[svgID];
					return scaleFunction(value);
				})
				.append("title") .text(function(d) {
					let key = idToKey[svgID];
					return "This value is " +  d[key];
				});
		}
	})
}


d3.json("data/small-data.json")
  .then(
	function(data){
		dataKeys = Object.keys(data[0]);
		console.table(data);

		// populate idToKey object
		CHRISTMAS_BALLS.forEach((key, idx) => idToKey[key] = dataKeys[idx]);
		drawPlot(data);
	}
  );