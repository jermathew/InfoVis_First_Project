// Refactor this code

// GLOBAL VARIABLES
// svg items class names
const CHRISTMAS_ITEMS = [
  "pine",
  "top-left-circle",
  "top-right-circle",
  "center-left-circle",
  "center-right-circle",
  "bottom-left-circle",
  "bottom-right-circle"
];

const CHRISTMAS_BALLS = CHRISTMAS_ITEMS.slice(1);

// side padding (percent)
const HORIZONTAL_PADDING = 0.01;

// viewport width and height
let pageWidth = window.innerWidth;
let pageHeight = window.innerHeight;

let svgHeight = pageHeight / 2;

// svg class name to dataset field map
let classNameToKeyMap = {};

// onclick event listener function
function onClickListener(xScale) {
  let selectedCircle = d3.select(this);
  let circleClass = selectedCircle.attr("class");
  let sortKey = classNameToKeyMap[circleClass];
  sortBars(sortKey, xScale);
}

// FUNCTIONS
// onmouseover event listener function
function onMouseOverListener(data) {
  let parentElement = d3.select(this);
  let dataRow = parentElement.data()[0];
  let selectedElement = d3.select(this);
  let selectedElementTagName = selectedElement.node().tagName;
  let tooltip = d3.select("#tooltip");
  let datasetFields = Object.values(classNameToKeyMap);
  let cardBody = tooltip.select("div.card-body");

  datasetFields.forEach(function(field) {
    cardBody
      .select("h6#" + field)
      .select("small.text-primary")
      .text(dataRow[field]);
  });
  // in case is a circle highlight the relative field value
  if (selectedElementTagName === "svg") {
    let className = selectedElement.attr("class");
    let fieldName = classNameToKeyMap[className];
    cardBody
      .select("h6#" + fieldName)
      .classed("text-primary", false)
      .classed("text-danger", true)
      .select("small")
      .classed("text-primary", false)
      .classed("text-danger", true);
  }

  // show the tooltip
  tooltip.attr("hidden", null);
}

function onMouseOutListener() {
  let tooltip = d3.select("#tooltip");
  let datasetFields = Object.values(classNameToKeyMap);
  let cardBody = tooltip.select("div.card-body");

  datasetFields.forEach(function(field) {
    cardBody
      .select("h6#" + field)
      .classed("text-primary", true)
      .classed("text-danger", false)
      .select("small")
      .classed("text-primary", true)
      .classed("text-danger", false);
  });

  // hide the tooltip
  tooltip.attr("hidden", "");
}

// function which sorts christmas trees based on a given key
function sortBars(key, xScale) {
  let svg = d3.select("svg");

  let sortedTrees = svg.selectAll("g.christmas-tree").sort(function(a, b) {
    return d3.ascending(a[key], b[key]);
  });

  CHRISTMAS_ITEMS.forEach(function(svgID) {
    sortedTrees
      .select("." + svgID)
      .transition()
      .delay(function(d, i) {
        return i * 50;
      })
      .duration(1000)
      .attr("x", function(d, i) {
        return xScale(i);
      });
  });
}

function drawPlot(dataset) {
  // setting scales
  let xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.length))
    .rangeRound([
      pageWidth * HORIZONTAL_PADDING,
      pageWidth - pageWidth * HORIZONTAL_PADDING
    ])
    .paddingInner(0.1);

  let categoricalColorScale = d3
    .scaleOrdinal()
    .domain(CHRISTMAS_BALLS)
    .range(d3.schemeAccent);

  // map each field value to a sequential color scale
  let colorScaleMap = {};

  // map each field value to each christmas ball's radius
  let radiusScaleMap = {};

  // map each field value to each christmas ball's y position
  let yPositionScaleMap = {};

  CHRISTMAS_BALLS.forEach(function(svgID) {
    let color = categoricalColorScale(svgID);
    let datasetField = classNameToKeyMap[svgID];
    let minValue = d3.min(dataset, function(d) {
      return d[datasetField];
    });

    let maxValue = d3.max(dataset, function(d) {
      return d[datasetField];
    });

    // set color scale
    let colorScale = d3
      .scaleLinear()
      .domain([-maxValue / 2, maxValue])
      .range(["white", color]);

    // set radius scale
    let radiusScale = d3
      .scaleSqrt()
      .domain([minValue, maxValue])
      .range([30, 40]);

    let yPositionScale = d3.scaleSqrt().domain([minValue, maxValue]);

    switch (svgID) {
      case "top-left-circle":
      case "top-right-circle":
        yPositionScale.range([150, 160]);
        break;
      case "center-left-circle":
      case "center-right-circle":
        yPositionScale.range([280, 290]);
        break;
      case "bottom-left-circle":
      case "bottom-right-circle":
        yPositionScale.range([443, 453]);
        break;
    }

    colorScaleMap[svgID] = colorScale;
    radiusScaleMap[svgID] = radiusScale;
    yPositionScaleMap[svgID] = yPositionScale;
  });

  // initializing tooltip
  let tooltip = d3.select("#tooltip");
  let datasetFields = Object.values(classNameToKeyMap);
  let cardBody = tooltip.select("div.card-body");

  datasetFields.forEach(function(field) {
    cardBody
      .append("h6")
      .classed("card-subtitle mb-2 text-primary", true)
      .attr("id", field)
      .text(field + ": ")
      .append("small")
      .classed("text-primary", true);
  });

  //Select SVG element
  let svg = d3
    .select("body")
    .append("svg")
    .attr("width", pageWidth)
    .attr("height", svgHeight);

  // set background color using a rect whichs spans the whole svg canvas
  svg
    .append("rect")
    .attr("width", pageWidth)
    .attr("height", svgHeight)
    .attr("fill", "#E0FFFF");

  //Create christmas trees placeholders
  let christmasTrees = svg
    .selectAll("g.christmas-tree")
    .data(dataset)
    .enter()
    .append("g")
    .classed("christmas-tree", true)
    .attr("pointer-events", "none");

  // put a pine and six christmas balls for each placeholder
  CHRISTMAS_ITEMS.forEach(function(svgID) {
    let dataRow = christmasTrees;
    let item = null;

    if (svgID === "pine") {
      item = christmasTrees
        .append("use")
        .attr("href", "images/christmas-tree.svg#" + svgID);
    } else {
      item = christmasTrees.append("svg").attr("viewBox", "-3 0 512 512.00001");
    }

    item
      .classed(svgID, true)
      .attr("x", function(d, i) {
        return xScale(i);
      })
      .attr("width", xScale.bandwidth())
      .attr("pointer-events", "auto")
      .on("mouseover", function(d) {
        onMouseOverListener.call(this);
      })
      .on("mouseout", function() {
        onMouseOutListener.call(this);
      });

    if (svgID !== "pine") {
      item
        .on("click", function() {
          onClickListener.call(this, xScale);
        })
        .attr("preserveAspectRatio", "xMidYMax meet")
        .append("title")
        .text(function(d) {
          let key = classNameToKeyMap[svgID];
          return "This value is " + d[key];
        });

      let circle = item
        .append("circle")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", function(d, i) {
          let key = classNameToKeyMap[svgID];
          let value = d[key];
          let scaleFunction = colorScaleMap[svgID];
          return scaleFunction(value);
        })
        .attr("r", function(d, i) {
          let key = classNameToKeyMap[svgID];
          let value = d[key];
          let scaleFunction = radiusScaleMap[svgID];
          return scaleFunction(value);
        });

      switch (svgID) {
        case "top-left-circle":
          circle.attr("cx", "69");
          break;
        case "top-right-circle":
          circle.attr("cx", "437");
          break;
        case "center-left-circle":
        case "bottom-left-circle":
          circle.attr("cx", "44");
          break;
        case "center-right-circle":
        case "bottom-right-circle":
          circle.attr("cx", "462");
          break;
      }

      circle.attr("cy", function(d, i) {
        let key = classNameToKeyMap[svgID];
        let value = d[key];
        let scaleFunction = yPositionScaleMap[svgID];
        return scaleFunction(value);
      });
    }
  });
}

// main scripts
d3.json("data/data.json").then(function(data) {
  dataKeys = Object.keys(data[0]);
  console.table(data);

  // populate classNameToKeyMap
  CHRISTMAS_BALLS.forEach(
    (key, idx) => (classNameToKeyMap[key] = dataKeys[idx])
  );
  drawPlot(data);
});
