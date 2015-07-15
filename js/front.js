addEventListener("load", function () {
  new Vue({
    el: "#control",
    data: {
      filenum: "100000"
    },
    watch: {
      filenum: function (val) {
        draw("results/" + val + ".csv");
      }
    },
    created: function () {
      draw("results/" + this.$data.filenum + ".csv");
    }
  });
});

function draw(file) {
  d3.select("svg").remove();
  var svg = d3.select("#graph")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 500);
  d3.csv(file, function (data) {
    return {
      x: Number(data.x) * 100 + 400,
      ann: -Number(data.ann) * 100 + 200,
      sin: -Number(data.sin) * 100 + 200
    };
  }, function (err, data) {
    if (err) throw err;

    svg.selectAll("circle.sin")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.sin;
      }).attr("r", 2);

    svg.selectAll("circle.ann")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "red")
      .attr("cx", function (d) {
        return d.x;
      }).attr("cy", function (d) {
        return d.ann;
      }).attr("r", 2);
  });
}
