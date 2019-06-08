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
	console.log(this)
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
		sortedTrees.select("." + svgID)
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
	let colorScaleMap = {}

	// map each field value to each christmas ball's radius
	let radiusScaleMap = {}

	CHRISTMAS_BALLS.forEach(function(svgID){
		let color = ballColors(svgID);
		let datasetField = idToKey[svgID];
		let minValue = d3.min(dataset, function(d){
			return d[datasetField];
		});

		let maxValue = d3.max(dataset, function(d){
			return d[datasetField];
		});

		// set color scale
		let colorScale = d3.scaleLinear()
									 .domain([0, maxValue])
		  							 .range(["white", color]);
		
		colorScaleMap[svgID] = colorScale;

		// set radius scale
		let radiusScale = d3.scaleSqrt()
							.domain([minValue, maxValue])
							.range([20, 40]);

		radiusScaleMap[svgID] = radiusScale;
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
		let item = null;

		if(svgID === "pine") {
			item = christmasTrees.append("use")
								 .attr("href", "images/christmas-tree.svg#" + svgID);
		}

		else {
			item = christmasTrees.append("svg")
					 			 .attr("viewBox", "-3 0 512 512.00001")
		}

		item.classed(svgID, true)
			.attr("x", function(d, i) {
				 return xScale(i);
			})
			.attr("width", xScale.bandwidth())
			.attr("pointer-events", "auto");

								
		if(svgID !== "pine"){

			item.on("click", function(){
				triggerSort.call(this, xScale)
				})
				.append("title") .text(function(d) {
					let key = idToKey[svgID];
					return "This value is " +  d[key];
				});

			let circle = item.append("circle")
							 .attr("stroke", "black")
							 .attr("stroke-width", 2)
							 .attr("fill", function(d, i){
								let key = idToKey[svgID];
								let value = d[key];
								let scaleFunction = colorScaleMap[svgID];
								return scaleFunction(value);
							 })
							 .attr("r", function(d, i){
								let key = idToKey[svgID];
								let value = d[key];
								let scaleFunction = radiusScaleMap[svgID];
								return scaleFunction(value);
							 })

			switch (svgID) {
			  case "top-left-circle":
			    circle.attr("cx", "69")
			    	  .attr("cy", "160");
			    break;
			  case "top-right-circle":
			    circle.attr("cx", "437")
			    	  .attr("cy", "160");
			    break;
			  case "center-left-circle":
			    circle.attr("cx", "44")
			    	  .attr("cy", "290");
			    break;
			  case "center-right-circle":
			    circle.attr("cx", "462")
			    	  .attr("cy", "290");
			    break;
			  case "bottom-left-circle":
			    circle.attr("cx", "44")
			    	  .attr("cy", "433");
			    break;
			  case "bottom-right-circle":
			    circle.attr("cx", "462")
			    	  .attr("cy", "433");
			    break;
			}

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