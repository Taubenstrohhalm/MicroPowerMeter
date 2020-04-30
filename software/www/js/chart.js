// select svg with id'graph' (used as background) and use it 
// to calc width and height of the chart that will be overlayed
var svg = d3.select("#graph"),
            margin = {top: 0, right: 1, bottom: 1, left: 1},
            width = Math.floor(svg.attr("viewBox")
                        .split(" ")[2] - margin.left - margin.right),
            height = Math.floor(svg.attr("viewBox")
                        .split(" ")[3] - margin.top - margin.bottom);

// create 'g' element which will contain the data path's
var g = svg.append("g")
    .attr("id", "data")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create filter to 'clip' elements outside of frame
var defs = svg.append("defs").append("clipPath")
.attr("id", "clip2")
.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", width)
.attr("height", height);

// create empty array/dict/array to hold data 
let dta = [
    {id: "voltage_path",values: []},
    {id: "current_path",values: []},
    {id: "power_path",values: []}
];

// scaling/mapping the data to the width and height of the chart
var x = d3.scaleTime().range([0, width]);

var y_u = d3.scaleLinear().range([height, 0]) 
    .domain([0, volt_max]);
var y_i = d3.scaleLinear().range([height, 0])
    .domain([0, 15]);
var y_p = d3.scaleLinear().range([height, 0])
    .domain([0, 540]);

// functions to let user scale the data
function change_voltage_domain(volt_max){
    y_u.domain([0,volt_max]);
    y_axis_voltage.transition().duration(interval).call(d3.axisRight(y_u));
}
function change_current_domain(current_max){
    y_i.domain([0,current_max]);
    y_axis_current.transition().duration(interval).call(d3.axisRight(y_i));
}
function change_power_domain(current_max){
    y_p.domain([0,current_max]);
    y_axis_power.transition().duration(interval).call(d3.axisRight(y_p));
}

// create the lines by assigning data.x and data.y values
line_u = d3.line().curve(d3.curveBasis)
    .x(function(d) {return x(d.date);})
    .y(function(d) {return y_u(d.value);});
line_i = d3.line().curve(d3.curveBasis)
    .x(function(d) {return x(d.date);})
    .y(function(d) {return y_i(d.value);});
line_p = d3.line().curve(d3.curveBasis)
    .x(function(d) {return x(d.date);})
    .y(function(d) {return y_p(d.value);});

// create x-axis (time)
var x_axis = d3.axisTop().scale(x);
var x_axis_svg = svg.append("g")
    .attr("id","x_axis")
    .attr("transform", "translate(0," + height + ")");
    x_axis_svg.call(x_axis);

// create y-axis (voltage)
var y_axis_voltage = svg.append("g")
.attr("id","y_axis_voltage")
.attr("transform","translate(15,0)");
// .call(d3.axisRight(y_v));

// create y-axis (current)
var y_axis_current = svg.append("g")
.attr("id","y_axis_current")
.attr("transform","translate(40,0)");
//.call(d3.axisRight(y_a))

// create y-axis (power)
var y_axis_power = svg.append("g")
.attr("id","y_axis_power")
.attr("transform","translate(65,0)");
//.call(d3.axisRight(y_p))

let pathsG = g.append("g").attr("id", "paths").attr("class", "paths")
.attr("clip-path", "url(#clip2)");

let globalX = 0;
let duration = 1800; //how quickly to move (will look jerky if less that data input rate)
let limit = 20; // how many datapoints, total points = (duration * limit)

// draw the y-axis' by calling
change_voltage_domain(volt_per_devision*10);
change_current_domain(ampere_per_devision*10);
change_power_domain(ampere_per_devision*10);

//d3.select("#scope_lines").lower(); // select the added lines and move them on a lower layer

function updateChart(voltage, current, power, duration) {
    let now = new Date();
    dta[0].values.push({
        date: now,
        value: voltage / 1000
    });
    dta[1].values.push({
        date: now,
        value: current / 1000
    });
    dta[2].values.push({
        date: now,
        value: power / 1000
    });
    // Shift domain
    x.domain([now - ((limit - 2) * duration), now - duration])
    // Slide x-axis left
    x_axis_svg.transition().duration(duration).ease(d3.easeLinear, 2).call(x_axis);
    //Join
    var minerG = pathsG.selectAll(".minerLine").data(dta);
    var minerGEnter = minerG.enter()
    //Enter
    .append("g")
    .attr("class", "minerLine")
    .merge(minerG);
    //Join
    var minerSVG = minerGEnter.selectAll("path").data(function(d) {
        return [d];
    });
    var minerSVGenter = minerSVG.enter()
    //Enter
    .append("path")
    .attr("class", "line")
    .attr("id",function(d){
        return d.id; // assign id to individual path's
    })
    .merge(minerSVG)
    //Update
    .transition()
    .duration(duration)
    .ease(d3.easeLinear, 2)
    .attr("d", function(d) {
        if (d.id == 'voltage_path') {
            return line_u(d.values);
          } else if (d.id == 'current_path') {
            return line_i(d.values);
          } else {
            return line_p(d.values);
          }
    })
    .attr("transform", null);

    // trying to get rid of unused data... doesn't work with transition
    // if (dta[0].values.length >= limit*2+1){
    //     console.log("data limit reached")
    //     dta.forEach(element => {
    //         element.values.shift()
    //     });
    // }
}