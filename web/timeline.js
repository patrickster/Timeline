//   // jQuery(document).ready(function($){
//   //   $('#personsearch').autocomplete({source:'person_suggest.php?term=?', minLength:3});
//   // });

// $(function() {
//     $("#personsearch").autocomplete({
//     source: function( request, response ) {
//       console.log(request);
//       $.ajax({
//         url: "http://lookup.dbpedia.org/api/search.asmx/PrefixSearch?QueryClass=Person&MaxHits=8&QueryString=" + request["term"],
//         dataType: "xml",
//         success: function( xmlResponse ) {
//           response( ($( xmlResponse).find("Result") ).map(function() {
//             return {
//               value: ($(this)).find("Label:first").text(),
//               id: ($(this)).find("URI:first").text()
//             };
//           }));
//         }
//       });
//     },
//     minLength: 4
//   });
// });

// $(function() {
//   $( "#personsearch" ).autocomplete({
//     source: function( request, response ) {
//       $.ajax({
//         url: "http://http://localhost:8888/timeline/person_suggest.php?jsonp_callback=?",
//         jsonp: "jsonp_callback",
//         data: {
//           featureClass: "P",
//           style: "full",
//           maxRows: 12,
//           name_startsWith: request.term
//         },
//         success: function( data ) {
//           alert(data);
//           response( $.map( data, function( item ) {
//             return {
//               label: item.label,
//               value: item.value
//             }
//           }));
//         }
//       });
//     },
//     minLength: 2,
//     select: function( event, ui ) {
//       log( ui.item ?
//         "Selected: " + ui.item.label :
//           "Nothing selected, input was " + this.value);
//     }
//   });
// });

// function suggest(inputString) {
//   if (inputString.length > 3) {
//     $.ajax({
//       url: "http://localhost:8888/person_suggest.php",
//       type: "post",
//       data: { term : inputString },
//       success: function(data) {
//         alert(data);
//       }
//     });
//   }
// }


/* Graphical parameters */
var CANVAS_WIDTH = 1200, 
    CANVAS_HEIGHT = 515,
    LEFT_MARGIN = 200,
    RIGHT_MARGIN = 200,
    TOP_MARGIN = 20,
    BOTTOM_MARGIN = 5, 
    BAR_HEIGHT = 10, // height of each bar
    LINE_SPACING = 20, // vertical distance between lines
    FIRST_LINE_OFFSET = 5,
    NAME_OFFSET = 8;
    CLOSE_ICON_OFFSET = 8;

/* Other constants */
var MAX_RESULTS = 10,
    MAX_ROWS = 24,
    MAX_NAME_LENGTH = 25;
    CURRENT_YEAR = 2013;

/* Variables */
var svg, timeScale, xAxis, tickFormat,
    cache = [],
    data = [],
    currentIndex = 0, 
    currentID = 0,
    minYear = 1695,
    maxYear = 1905;

/**
 * Returns the y-position of a row at the specified index
 */
function getYPos(index) {
  return (TOP_MARGIN + FIRST_LINE_OFFSET + LINE_SPACING * index + BAR_HEIGHT / 2);
}

/**
 * Creates a path data string for a guideline at the specified height (y)
 */
function createGuidelinePath(y) {
  return "M " + LEFT_MARGIN + " " +  y + " L " + (CANVAS_WIDTH - RIGHT_MARGIN) + " " + y;
}

function updateAxis () {

  var births = data.map(function(e) { return e.birth} );
  var deaths = data.map(function(e) { return e.death} );

  var oldMinYear = minYear, 
    oldMaxYear = maxYear;
  var minBirth = Math.min.apply(Math, births);
  var maxDeath = Math.max.apply(Math, deaths);
  
  var intMinYear = 50 * Math.floor(minBirth / 50) - 5;
  var intMaxYear = 50 * Math.ceil(maxDeath / 50) + 5;

  if (intMaxYear > CURRENT_YEAR) {
    intMaxYear = CURRENT_YEAR;
  }
  minYear = intMinYear;
  maxYear = intMaxYear;
  if (minYear == oldMinYear && maxYear == oldMaxYear) {
    return false;
  }
  return true;
}


/**
 * Rescale bars and axes 
 */
function rescale(delay) {

  // Create time scale for new axis limits
  timeScale = d3.scale.linear()
      .domain([minYear, maxYear])
      .range([LEFT_MARGIN, CANVAS_WIDTH - RIGHT_MARGIN]);

  // Update axis
  xAxis.call(d3.svg.axis()
               .scale(timeScale)
               .orient("top")
               .tickSize(6,3,0)
               .tickFormat(tickFormat));

  // Add transitions for each bar
  svg.selectAll(".bar").transition()
    .attr("x", function(d) {
      return(timeScale(d.birth));
    })  
    .attr("width", function(d) {
      return(timeScale(d.death) - timeScale(d.birth));
    })
    .delay(delay);
}

// function createCloseIconPath(y) {
//   var h = 8;
//   var r = 1.5;
//   var x = CANVAS_WIDTH - RIGHT_MARGIN + 10;
//   var tan45 = Math.tan(Math.PI / 4);
//   var path = "M" + (x)                       + " " + (y + r)
//            + "L" + (x + tan45 * (h / 2 - r)) + " " + (y + h / 2)
//            + "L" + (x + h / 2)               + " " + (y + tan45 * (h / 2 - r))
//            + "L" + (x + r)                   + " " + (y)
//            + "L" + (x + h / 2)               + " " + (y - tan45 * (h / 2 - r))
//            + "L" + (x + tan45 * (h / 2 - r)) + " " + (y - h / 2)
//            + "L" + (x)                       + " " + (y - r)
//            + "L" + (x - tan45 * (h / 2 - r)) + " " + (y - h / 2)
//            + "L" + (x - h / 2)               + " " + (y - tan45 * (h / 2 - r))
//            + "L" + (x - r)                   + " " + (y)
//            + "L" + (x - h / 2)               + " " + (y + tan45 * (h / 2 - r))
//            + "L" + (x - tan45 * (h / 2 - r)) + " " + (y + h / 2) 
//            + "Z";
//   return path;
// }

function createCanvas() {

  // Axis tick format
  tickFormat = d3.format("0d");

  // Axis scale
  timeScale = d3.scale.linear()
    .domain([1695, 1905])
    .range([LEFT_MARGIN, CANVAS_WIDTH - RIGHT_MARGIN]);

  // Create svg canvas
  svg = d3.select("#timeline_div").append("svg:svg")
    .attr("id", "timeline")
    .attr("width", CANVAS_WIDTH)
    .attr("height", CANVAS_HEIGHT);

  // Create group for rows
  svg.append("g").attr("id", "rows");


  // Add x-axis
  xAxis = svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + 20 + ")")
    .call(d3.svg.axis()
                .scale(timeScale)
                .orient("top")
                .tickSize(6,3,0)
                .tickFormat(tickFormat));

  // Create path data string for timeline border
  var borderPath = "M" + LEFT_MARGIN + " " + TOP_MARGIN +
                  " L" + LEFT_MARGIN + " " + (CANVAS_HEIGHT - BOTTOM_MARGIN) +
                  " L" + (CANVAS_WIDTH - RIGHT_MARGIN) + " " + (CANVAS_HEIGHT - BOTTOM_MARGIN) +
                  " L" + (CANVAS_WIDTH - RIGHT_MARGIN) + " " + TOP_MARGIN + "Z";

  // Append border path
  svg.append("svg:path")
    .attr("class", "border")
    .attr("d", borderPath);

}



function addLifespan( name, years ) {

  if ( name.length > MAX_NAME_LENGTH ) {
    name = name.substring( 0, 25 ) + "...";
  }

  // Don't do anything if display is full
  if ( currentIndex == MAX_ROWS ) {
    return;
  }

  var birth = years.birth,
    death = years.death;

  if ( death == 0 ) {
    death = 2013;
  }

  // Compute lifespan
  var span = death - birth;
  if ( death < 0 & birth < 0 ) {
    span--;
  }

  data.push({
    id: currentID,
    name: name,
    birth: birth,
    death: death,
    span: span
  });
  
  // Delay in adding new bar (0 unless plot needs to be rescaled)
  var delay = 0; 

  var axisChanged = updateAxis();
  if (axisChanged) {
    rescale(0);
    delay = 250;
  }

  // Compute endpoints of new bar
  var birthX = timeScale(birth);
  var deathX = timeScale(death);

  // Append row 
  var newRow = svg.select("#rows").append("g")
    .attr("class", "row")
    .datum({id: currentID, index: currentIndex, birth: birth, death: death});

  var y = getYPos(currentIndex);

  newRow.append("svg:path")
    .attr("class", "guideline")
    .attr("d", createGuidelinePath(y + BAR_HEIGHT / 2));

  var addedBar = newRow.append("rect")
    .attr("class", "bar")
    .attr("x", birthX)
    .attr("y", 30 + 20 * currentIndex)
    .attr("height", BAR_HEIGHT)
    .attr("width", 0)
    .style("fill", "rgb(100,100,120)")
    .on("mouseover", function() {
      d3.select(this).style("fill", "#ED5456")
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", "rgb(90,90,100)")
    })
    .on("click", function(d) {
      removeRow(d.index);
    });

  addedBar.transition()
    .delay(delay)
    .duration(250)
    .attr("width", deathX - birthX);

  newRow.append("svg:text")
    .attr("class", "name")
    .attr("x", LEFT_MARGIN - NAME_OFFSET)
    .attr("y", 30 + 20 * currentIndex + BAR_HEIGHT)
    .style("text-anchor", "end")
    .text(name);

  // Append close icon
  // var closeIconPath = createCloseIconPath(y);
  // newRow.append("svg:path")
  //   .attr("class", "closeIcon")
  //   .attr("d", closeIconPath);

  // newRow.append("svg:text")
  //   .attr("class", "name")
  //   .attr("x", CANVAS_WIDTH - RIGHT_MARGIN + 5)
  //   .attr("y", 30 + 20 * currentIndex + BAR_HEIGHT)
  //   .text(years.birth + " - " + years.death);

  // newRow.append("svg:text")
  //   .attr("class", "name")
  //   .attr("x", CANVAS_WIDTH - RIGHT_MARGIN + 5)
  //   .attr("y", 30 + 20 * currentIndex + BAR_HEIGHT)
  //   .text("Click to remove");

    // .attr("dy", "4px")

  // newRow.append("svg:image")
  //   .datum(currentIndex)
  //   .attr("class", "close_icon")
  //   .attr("x", CANVAS_WIDTH - RIGHT_MARGIN + 10)
  //   .attr("y", 30 + 20 * currentIndex + 1)
  //   .attr("height", 8)
  //   .attr("width", 8)
  //   .attr("xlink:href", "./x.png")
  //   .on("click", function(d) { removeRow(d) });

  newRow.append("text")
    .datum(currentIndex)
    .attr("class", "close_icon")
    .attr("x", CANVAS_WIDTH - RIGHT_MARGIN + CLOSE_ICON_OFFSET)
    .attr("y", 30 + 20 * currentIndex + BAR_HEIGHT)
    .text("\u2715")
    .style("font-family", "fontello")
    .on("click", function(d) { removeRow(d) })
    .on("mouseover", function() {
      d3.select(this).style("fill", "grey")
    })
    .on("mouseout", function() {
      d3.select(this).style("fill", "black")
    });

    
// <i class="icon-cancel"></i>

  // console.log(currentIndex);

  // Increment current index/ID
  currentIndex += 1;  
  currentID += 1;
}


function sortRows() {
  for (var i = 0; i < data.length; i++) {
    var id = data[i].id;
    moveRow(id, i);
  }
}


function moveRow(id, new_index) {
  
  // Select row with specified ID
  var row = svg.selectAll(".row").filter(function(d) {
    return d.id == id;
  });

  // Update the index for this row
  var d = row.datum();
  d.index = new_index;
  row.datum(d);

  // Get y-position for new index
  var newY = getYPos(new_index);

  // Add transitions for row elements
  row.select(".bar").transition()
    .attr("y", newY);
  row.select(".guideline").transition()
    .attr("d", createGuidelinePath(newY + BAR_HEIGHT / 2));
  row.select(".name").transition()
    .attr("y", (newY + BAR_HEIGHT));
  var close_icon = row.select(".close_icon");
  close_icon.transition()
    .attr("y", (newY + BAR_HEIGHT));
  close_icon.datum(new_index);

}


/* Comparison functions for sorting */
function compareBirths (a, b) {
  if (a.birth < b.birth) 
    return -1
  if (a.birth > b.birth)
    return 1
  return 0
}

function compareLifespans (a, b) {
  if (a.span < b.span) 
    return -1
  if (a.span > b.span)
    return 1
  return 0
}

function compareNames (a, b) {
  if (a.name < b.name) 
    return -1
  if (a.name > b.name)
    return 1
  return 0
}

/* Wrapper functions for sorting */
function sortByBirth() {
  data.sort(compareBirths);
  sortRows();
}

function sortByName() {
  data.sort(compareNames);
  sortRows();
}

function sortByLifespan() {
  data.sort(compareLifespans);
  sortRows();
}


function shiftUp () {
  var row = d3.select(this);
  var index = row.datum().index;
  var id = row.datum().id;
  moveRow(id, index - 1);
}

function clear() {
  svg.selectAll(".row").remove();
  data = [];
  currentIndex = 0;
}

/**
 * Removes the row at the specified index
 */
function removeRow (index) {

  // Select and remove row at specified index
  svg.selectAll(".row").filter(function(d) {
    return d.index == index;
  }).remove();

  // Call shiftUp function on rows at higher indices
  svg.selectAll(".row").filter(function(d) {
    return d.index >= index;
  }).each(shiftUp);

  // Remove data at specified index
  data.splice(index, 1);

  // Decrement currentIndex
  currentIndex -= 1;

  // Check if axes need to be updated (if there are > 0 bars remaining)
  if (currentIndex > 0) {
    var axesUpdated = updateAxis();
    if (axesUpdated) {
      rescale(500);  
    }
  }

}

function submit(value) {
  if (value in cache) {
    addLifespan(value, cache[value]);
  }
}

$(document).ready(function() {

  createCanvas();

  $("#search_box").autocomplete({
    source: function( request, response ) {
      $.ajax({
        url: "http://localhost:8888/person_suggest.php",
        type: "post",
        dataType: "json",
        data : { term : request["term"] },
        success: function( data ) {
          // Limit number of results displayed
          data = data.slice(0, MAX_RESULTS); 
          response( $.map( data, function( item ) {
            cache[item.label] = item.value;
            return item.label;
          }));
        }
      });
    },
    search: function() {
      $("#search_box").addClass( "ui-autocomplete-loading" );
      console.log("searching");
    },
    minLength: 4
  });

  $("#search_box").keypress(function (e) {
    if (e.which == 13) {
      submit(this.value);
      this.value = "";
      return false;
    }
  });
  
  $("#clear_all").click(function () {
    clear();
  });

  $("#name_sort").click(function () {
    sortByName();
  });

  $("#birth_sort").click(function () {
    sortByBirth();
  });

  $("#lifespan_sort").click(function () {
    sortByLifespan();
  });


});

