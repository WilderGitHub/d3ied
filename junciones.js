function mausaut() {
  d3.select(this).attr("opacity", 0.5);
  d3.select("#tip").style("visibility", "hidden");
}
export { mausaut };