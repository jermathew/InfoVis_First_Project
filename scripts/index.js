// BIG TODO: REFACTOR THIS CODE
d3.json("data/small-data.json")
  .then(
	  function(data){
		  console.table(data);
		  drawPlot(data);
	  }
  );



function drawPlot(dataset){

	// onclick event listener function
	function triggerSort(){
		let selectedCircle = d3.select(this)
		let circleClass = selectedCircle.attr("class")
		let sortKey = null
		switch (circleClass) {
			case "top-left-circle":
			  sortKey = 'a';
			  break;
			case "top-right-circle":
			  sortKey = 'b';
			  break;
			case "center-left-circle":
			  sortKey = 'c';
			  break;
			case "center-right-circle":
			  sortKey = 'd';
			  break;
			case "bottom-left-circle":
			   sortKey = 'e';
				break;
			case "bottom-right-circle":
			   sortKey = 'f';
			  break;
		}
		sortBars(sortKey);
	}

	function sortBars(key) {
		var svg = d3.select("svg");
		var sortedTrees = svg.selectAll("g.christmas-tree")
							 .sort(function(a, b) {
								 return d3.ascending(a[key], b[key]);
								 });
		
		sortedTrees.select("use.pine")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});

		sortedTrees.select("use.top-left-circle")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});

		sortedTrees.select("use.top-right-circle")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});

		sortedTrees.select("use.center-left-circle")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});

		sortedTrees.select("use.center-right-circle")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});

		sortedTrees.select("use.bottom-left-circle")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});

		sortedTrees.select("use.bottom-right-circle")
					.transition()
					.delay(function(d, i) {
						return i * 50;
					})
					.duration(1000)
					.attr("x", function(d, i) {
						return xScale(i);
					});
	};

	var xScale = d3.scaleBand()
					.domain(d3.range(dataset.length))
					.rangeRound([0, 1250]) // edit this line
					.paddingInner(0.1);

	//Select SVG element
	var svg = d3.select("svg");

	//Create christmas trees placeholders
	var christmasTrees = svg.selectAll("g.christmas-tree")
							.data(dataset)
							.enter()
							.append("g")
							.classed("christmas-tree", true)
							.attr("pointer-events", "none");


	//Put a pine for each placeholder
	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#pine")
				  .classed("pine", true)
				  .attr("x", function(d, i) {
					  return xScale(i);
					})
				  .attr("width", xScale.bandwidth())
				  .attr("pointer-events", "auto");
	

	// Add christmas balls for each pine
	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#top-left-circle")
				  .attr("x", function(d, i) {
					return xScale(i);
				  })
				  .attr("width", xScale.bandwidth())
				  .classed("top-left-circle", true)
				  .attr("pointer-events", "auto")
				  .on("click", triggerSort)
				  .append("title") .text(function(d) {
					return "This value is " + d['a']; });
	
	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#top-right-circle")
				  .attr("x", function(d, i) {
					return xScale(i);
				  })
				  .attr("width", xScale.bandwidth())
				  .classed("top-right-circle", true)
				  .attr("pointer-events", "auto")
				  .on("click", triggerSort)
				  .append("title") .text(function(d) {
					return "This value is " + d['b']; });	


	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#center-left-circle")
				  .attr("x", function(d, i) {
					return xScale(i);
				  })
				  .attr("width", xScale.bandwidth())
				  .classed("center-left-circle", true)
				  .attr("pointer-events", "auto")
				  .on("click", triggerSort)
				  .append("title") .text(function(d) {
					return "This value is " + d['c']; });	
 

	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#center-right-circle")
				  .attr("x", function(d, i) {
					return xScale(i);
				  })
				  .attr("width", xScale.bandwidth())
				  .classed("center-right-circle", true)
				  .attr("pointer-events", "auto")
				  .on("click", triggerSort)
				  .append("title") .text(function(d) {
					return "This value is " + d['d']; });


	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#bottom-left-circle")
				  .attr("x", function(d, i) {
					return xScale(i);
				  })
				  .attr("width", xScale.bandwidth())
				  .classed("bottom-left-circle", true)
				  .attr("pointer-events", "auto")
				  .on("click", triggerSort)
				  .append("title") .text(function(d) {
					return "This value is " + d['e']; });

	christmasTrees.append("use")
				  .attr("href", "images/christmas-tree.svg#bottom-right-circle")
				  .attr("x", function(d, i) {
					return xScale(i);
				  })
				  .attr("width", xScale.bandwidth())
				  .classed("bottom-right-circle", true)
				  .attr("pointer-events", "auto")
				  .on("click", triggerSort)
				  .append("title") .text(function(d) {
					return "This value is " + d['f']; });
}