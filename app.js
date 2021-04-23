//import { mausaut } from "/junciones.js";

d3.json("datos1.json").then(function (data) {
  /* data.forEach((d) => {
    d["Saldo IED"] = d["Saldo IED"];
  }); */

  const unicosSectores = [...new Set(data.map((data) => data.Sector))];
  const misColores = ["red", "blue", "green", "purple"];
  //////esta juncion junciona
  /* const sumaSector = data
    .filter((d) => d.Sector === "Minería")
    .reduce((a, b) => {
      return a + b.Deuda;
    }, 0); */
  /////esto junciona pero falta asignar a un array//////////////////////////////////////////
  /*  const cadaSector = (sectorito) =>
    data
      .filter((data) => data.Sector === sectorito)
      .reduce((a, b) => {
        return a + b.Deuda;
      }, 0);

  const e = unicosSectores.forEach((d) => console.log(d + " " + cadaSector(d)));
  console.log(e); */

  /////////////////calculo de los extents y margenes
  const minmaxCapital = d3.extent(data, (d) => d.Capital),
    minmaxDeuda = d3.extent(data, (d) => d.Deuda),
    minmaxIED = d3.extent(data, (d) => d["Saldo IED"]);
  const margenes = { izquierda: 100, derecha: 100, arriba: 100, abajo: 100 },
    alto = 700 - margenes.arriba - margenes.abajo,
    ancho = 900 - margenes.izquierda - margenes.derecha;
  /////Calculo de las escalas
  const escalaX = d3.scaleLinear().domain(minmaxDeuda).range([0, ancho]);
  const escalaY = d3.scaleLinear().domain(minmaxCapital).range([alto, 0]);
  const escalaBolita = d3.scaleLinear().domain(minmaxIED).range([0, 100]); //aqui encontrar un jormula */
  ////ver que esto funcione oe
  const escalaColores = d3
    .scaleOrdinal()
    .domain(unicosSectores)
    .range(d3.schemeTableau10);
  /////seteo de la transishon
  const transicion = d3.transition().duration(500).ease(d3.easeLinear);
  /////Creamos el svg
  const svg = d3
    .select("#contenedor")
    .append("svg")
    .attr("width", ancho + margenes.derecha + margenes.izquierda)
    .attr("height", alto + margenes.arriba + margenes.abajo);
  //// seteamos los colores para cada Sector, mejor si ves un proceso que lea todos los sectores de uan

  const colorSectores = (x) =>
    /// ESTOS SERIAN LOS COLORES PERSONALIZADOS
    /* misColores[unicosSectores.findIndex((d) => d === x)];   */
    d3.schemeTableau10[unicosSectores.findIndex((d) => d === x)];
  ////el DIV del tooltip
  const div = d3.select("#tip").style("opacity", 1);
  ////EVENTOS
  function mausaut() {
  d3.select(this).attr("opacity", 0.5);
  d3.select("#tip").style("visibility", "hidden");
}
  function mausova(d) {
    d3.select(this).attr("opacity", 1);
    d3.select("#tip")
      .data(data)
      .style("visibility", "visible")
      .html("<strong>" + d.Empresa + "<br/>" + "Deuda: " + d.Deuda)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px");
  }
  ///////leyendas
  function algo(data) {
    const w = data;
    console.log(w);
    d3.select("#contenedor")
      .data(data)
      .selectAll("circle")

      .attr("cx", (d) =>
        d.Sector === w ? escalaX(d.Deuda) + margenes.izquierda : 0
      )
      .attr("cy", (d) =>
        d.Sector === w ? escalaY(d.Capital) + margenes.arriba : 0
      )
      .transition(transicion)
      .attr("r", (d) => (d.Sector === w ? escalaBolita(d["Saldo IED"]) : 0));
  }
  function algo1(data1) {
    d3.select("#contenedor")
      .data(data)
      .selectAll("circle")

      .attr("cx", (d) => escalaX(d.Deuda) + margenes.izquierda)
      .attr("cy", (d) => escalaY(d.Capital) + margenes.arriba)

      .attr("r", (d) => escalaBolita(d["Saldo IED"]));
  }
  const leyendas = d3
    .select("#contenedor")
    .append("svg")
    .attr("transform", "translate(-200,100)")

    .attr("width", 500)
    .attr("height", 500)
    .attr("x", 200)
    .attr("y", 200)
    .selectAll("text")
    .data(unicosSectores)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("x", 10)
    .attr("y", (d, i) => i * 20 + 200)

    .style("fill", (d) => colorSectores(d))
    .style("font-family", "Arial")
    .style("font-size", 20)
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .on("mouseover", algo)
    .on("mouseout", algo1);

  ////creamos los circulos
  const circle = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .on("mouseover", mausova)
    .on("mouseout", mausaut)
    .attr("cx", (d) =>
      d.Sector === d.Sector ? escalaX(d.Deuda) + margenes.izquierda : 0
    )
    .attr("cy", (d) =>
      d.Sector === d.Sector ? escalaY(d.Capital) + margenes.arriba : 0
    )

    .transition(transicion)
    .attr("r", (d) =>
      d.Sector === d.Sector ? escalaBolita(d["Saldo IED"]) : 0
    )
    .attr("opacity", 0.5)
    .style("stroke", "black")
    /* .style("fill", escalaColores(d.Sector)); */
    .style("fill", (d) => colorSectores(d.Sector));

  ////creamos los textos
  const textos = svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")

    .classed("labelBola", true)
    /* .text((d) => (d["Saldo IED"] === minmaxIED[1] ? d.Empresa : "")) */
    .text((d) => d.Empresa)
    .style("visibility", "hidden")
    .attr("x", (d) => escalaX(d.Deuda) + margenes.izquierda)
    .attr("y", (d) => escalaY(d.Capital) + margenes.arriba);

  //////dibujamos los ejes
  const ejeH = svg
    .append("g")

    .attr(
      "transform",
      `translate(${margenes.izquierda},${escalaY(0) + margenes.arriba})`
    )
    .call(d3.axisBottom(escalaX).tickSizeOuter(0).ticks(15));

  const ejeV = svg
    .append("g")
    .attr(
      "transform",
      `translate(${margenes.izquierda + escalaX(0)},${margenes.arriba})`
    ) // This controls the vertical position of the Axis
    .call(d3.axisLeft(escalaY));
  //////juncion que encontre en el internet
  /* const resumidito = Object.values(
    data.reduce(
      (a, c) => (
        (a[c.Sector] = a[c.Sector]
          ? ((a[c.Sector].Deuda += c.Deuda),
            (a[c.Sector].Capital += c.Capital),
            (a[c.Sector]["Saldo IED"] += c["Saldo IED"]),
            a[c.Sector])
          : c),
        a
      ),
      {}
    )
  ); */
  /* console.log(resumidito); */

  /////////ahora hago las barras del resumen

  const svgBarras = d3
    .select("#contenedor")
    .append("svg")
    .attr("width", 400)
    .attr("height", 300);
  const barras = svgBarras
    .selectAll("rect")
    .data(resumidito)
    .enter()
    .append("rect")
    .attr("width", 10)
    .attr("height", (d) => d.Deuda + 30) ///ver aqui los valores negativos que puede salir en Capital oe
    .attr("x", (d, i) => i * 12 + 30)
    .attr("y", 45)
    .attr("fill", (d) => colorSectores(d.Sector))
    .attr("opacity", 1);
  /* .style("fill", escalaColores(d.Sector)); */
});

/* d3.interval(function (d) {
  console.log("algo");
}, 1000);
 */
