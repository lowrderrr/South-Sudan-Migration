var set1 = [{x:10,y:8.04},{x:8,y:6.95},{x:13,y:7.58},{x:9,y:8.81},{x:11,y:8.33},{x:14,y:9.96},{x:6,y:7.24},{x:4,y:4.26},{x:12,y:10.84},{x:7,y:4.82},{x:5,y:5.68}]

var set2 = [{x:10,y:9.14},{x:8,y:8.14},{x:13,y:8.74},{x:9,y:8.77},{x:11,y:9.26},{x:14,y:8.1},{x:6,y:6.13},{x:4,y:3.1},{x:12,y:9.13},{x:7,y:7.26},{x:5,y:4.74}]

var set3 = [{x:10,y:7.46},{x:8,y:6.77},{x:13,y:12.74},{x:9,y:7.11},{x:11,y:7.81},{x:14,y:8.84},{x:6,y:6.08},{x:4,y:5.39},{x:12,y:8.15},{x:7,y:6.42},{x:5,y:5.73}]

var set4 = [{x:8,y:6.58},{x:8,y:5.76},{x:8,y:7.71},{x:8,y:8.84},{x:8,y:8.47},{x:8,y:7.04},{x:8,y:5.25},{x:19,y:12.5},{x:8,y:5.56},{x:8,y:7.91},{x:8,y:6.89}];

var svg = d3.select("#chart")
.append("svg")
.attr("width",300)
.attr("height",300)

var svg2 = d3.select("#chart")
.append("svg")
.attr("width",300)
.attr("height",300)

function lineChart2(data,columnInUse,svg,stroke){

    var yScale = d3.scaleLinear()
    .domain([0,20])
    .range([200,0])

    var xScale = d3.scaleLinear()
    .domain([0,11])
    .range([0,220]);

    var ourLine =d3.line()
    .x(function(d,i){return i*20})
    .y(function(d){return yScale(d[columnInUse]);});

    svg.append("path")
    .data([data])
    .attr("d",ourLine)
    .attr("fill","none")
    .attr("opacity",.3)
    .attr("stroke",stroke)
    .attr("transform","translate(30,30)");

    svg.append("text")
    .text(columnInUse)
    .attr("x",10)
    .attr("y",10)

    var xAxis = d3.axisBottom().scale(xScale)
    var yAxis = d3.axisLeft().scale(yScale)
    svg.append("g").call(xAxis).attr("transform","translate(30,230)")
    svg.append("g").call(yAxis).attr("transform","translate(30,30)")
}

lineChart2(set1,"x",svg,"red")
lineChart2(set2,"x",svg,"red")
lineChart2(set3,"x",svg,"red")
lineChart2(set4,"x",svg,"red")

lineChart2(set1,"y",svg2,"blue")
lineChart2(set2,"y",svg2,"blue")
lineChart2(set3,"y",svg2,"blue")
lineChart2(set4,"y",svg2,"blue")