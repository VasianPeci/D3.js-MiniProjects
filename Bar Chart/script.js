let dataset = [];
const padding = 50;
const w = 1500;
const h = 600;
d3.select("body").append("h1").text("Federal Reserve Economic Data");
const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
const tooltip = d3.select("#tooltip");
let xScale;
let yScale;

svg.append("title").text("Federal Reserve Economic Data").attr("id", "title");

document.addEventListener("DOMContentLoaded", async function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      data.data.forEach((d) => dataset.push(d));
      xScale = d3
        .scaleBand()
        .domain(dataset.map((d) => d[0]))
        .range([padding, w - padding])
        .padding(0);
      yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h - padding, padding]);
      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(d[0])) // <- fix here
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => h - padding - yScale(d[1]))
        .attr("fill", "blue")
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "orange");
          tooltip
            .attr("data-date", this.getAttribute("data-date"))
            .style("opacity", 1)
            .html(`<strong>${d[0]}</strong><br>GDP: $${d[1]} Billion`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "blue");
          tooltip.style("opacity", 0);
        });

      const yAxis = d3.axisLeft(yScale);
      const xAxis = d3
        .axisBottom(xScale)
        .tickValues(
          xScale.domain().filter((d) => {
            const year = +d.slice(0, 4);
            const month = d.slice(5, 7);
            return year % 5 === 0 && month === "01";
          })
        )
        .tickFormat((d) => d.slice(0, 4));
      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("fill", "black")
        .attr("x", -h / 2 + padding)
        .attr("y", padding)
        .attr("transform", "rotate(-90)")
        .text("Gross Domestic Product");
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - padding})`)
        .call(xAxis);
    })
    .catch((err) => {
      console.log(err);
    });
});
