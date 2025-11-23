const h = 500;
const w = 1000;
const padding = 50;
const r = 5;

document.addEventListener("DOMContentLoaded", async function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data;
      d3.select("body")
        .append("h1")
        .text("Doping in Professional Bicycle Racing");
      const tooltip = d3.select("#tooltip");
      const svg = d3
        .select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
      svg
        .append("title")
        .text("Doping in Professional Bicycle Racing")
        .attr("id", "title");
      const xScale = d3
        .scaleLinear()
        .domain([1993, 2016])
        .range([padding, w - padding]);
      const yScale = d3
        .scaleLinear()
        .domain([
          d3.max(dataset, (d) => toSeconds(d["Time"])),
          d3.min(dataset, (d) => toSeconds(d["Time"])),
        ])
        .range([h - padding, padding]);
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
      const yAxis = d3.axisLeft(yScale).tickFormat((d) => toTime(d));
      svg
        .append("g")
        .attr("transform", `translate(0, ${h - padding})`)
        .attr("id", "x-axis")
        .call(xAxis);
      svg
        .append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .attr("id", "y-axis")
        .call(yAxis);

      const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${w - padding - 150}, ${padding})`);

      legend
        .append("rect")
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "blue");
      legend
        .append("text")
        .attr("x", 35)
        .attr("y", 17)
        .text("Doping Allegations");
      legend
        .append("rect")
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", 0)
        .attr("y", 50)
        .text("No Allegations")
        .attr("fill", "orange");
      legend.append("text").attr("x", 35).attr("y", 67).text("No Allegations");

      svg
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d["Year"]))
        .attr("cy", (d) => yScale(toSeconds(d["Time"])))
        .attr("r", r)
        .attr("fill", (d) => (d["Doping"] ? "blue" : "orange"))
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("class", "dot")
        .attr("data-xvalue", (d) => d["Year"])
        .attr("data-yvalue", (d) => timeToDate(d["Time"], d["Year"]))
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "orange");
          tooltip
            .attr("data-year", this.getAttribute("data-xvalue"))
            .style("opacity", 1)
            .html(
              `<strong>${this.getAttribute(
                "data-xvalue"
              )}</strong><br>Time: ${this.getAttribute("data-yvalue")}`
            )
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
    })
    .catch((err) => {
      console.log(err);
    });
});

function toSeconds(time) {
  return +time.slice(0, 2) * 60 + +time.slice(3, 5);
}

function toTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds - minutes * 60;
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

function timeToDate(time, year) {
  const [mm, ss] = time.split(":").map(Number);
  return new Date(year, 0, 1, 0, mm, ss);
}
