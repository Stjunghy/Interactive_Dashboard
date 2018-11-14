
function getValue() {
    value = document.querySelector("select").value;
    getDataPie(value);
    getDataTable(value);
    getDataGauge(value);
    getDataBubble(value);
}

function dropDown() {
    // data route
    var url = "/names";

    var list = Plotly.d3.select("#sampleList").append('select').attr("onchange", "getValue()")

    Plotly.d3.json(url, function (error, namesList) {
        if (error) return console.warn(error)

        list.selectAll('option')
            .data(namesList)
            .enter()
            .append('option')
            .text(function (d) { return d; });
    });
}

function getDataTable(sample_id) {
    var url_meta = "/metadata/" + sample_id;

    Plotly.d3.select("tbody").html("");

    Plotly.d3.json(url_meta, function (error, initDataMeta) {
        Plotly.d3.select("tbody").selectAll("tr")
            .data(initDataMeta)
            .enter()
            .append("tr")
            .html(function (d) {
                return `<td>${Object.keys(d)}</td><td>${d[Object.keys(d)]}</td>`
            })
    });


}

function getDataPie(sample_id) {
    var url = "/samples/" + sample_id;
    Plotly.d3.json(url, function (error, pieData) {
        if (error) return console.warn(error)

        var update = {
            values: [Object.values(pieData.sample_values)],
            labels: [Object.values(pieData.otu_ids)]
        };

        restylePlotly(update);
    });
};

function getDataBubble(sample_id) {
    var url = "/samples/" + sample_id;
    Plotly.d3.json(url, function (error, bubbleData) {
        if (error) return console.warn(error)

        var update = {
            x: [Object.values(bubbleData.otu_ids)],
            y: [Object.values(bubbleData.sample_values)],
            'marker.size': [Object.values(bubbleData.sample_values)],
            'marker.color': [Object.values(bubbleData.otu_ids)]
        };

        restylePlotlyBubble(update);
    });
};

function restylePlotlyBubble(update) {
    var BUBBLE = document.getElementById("plotBubble");
    Plotly.restyle(BUBBLE, update);
}

function restylePlotly(update) {
    var PIE = document.getElementById("plotPie");
    Plotly.restyle(PIE, update);
}


function getDataGauge(sample_id) {
    var url_gauge = "/wfreq/" + sample_id;

    Plotly.d3.json(url_gauge, function (error, dataGaugue) {

        gaugeChart(dataGaugue);
    });
}


function init() {


    dropDown();

    var urlPie = "/samples/BB_940";
    Plotly.d3.json(urlPie, function (error, initDataPie) {
        if (error) return console.warn(error)

        var data = [{
            values: Object.values(initDataPie.sample_values),
            labels: Object.values(initDataPie.otu_ids),
            type: "pie"
        }];

        var layout = {
        font: {family:"Balto"}
            };

        Plotly.plot("plotPie", data,layout);

    });

    
    var url_meta = "/metadata/BB_940";
    Plotly.d3.json(url_meta, function (error, initDataMeta) {
        Plotly.d3.select("tbody").selectAll("tr")
            .data(initDataMeta)
            .enter()
            .append("tr")
            .html(function (d) {
                return `<td>${Object.keys(d)}</td><td>${d[Object.keys(d)]}</td>`
            })
    });

    
    var urlGauge = "/wfreq/BB_940";
    Plotly.d3.json(urlGauge, function (error, dataGaugue) {
        if (error) return console.warn(error)

        var wfreq = dataGaugue

      
        const coefficient = 180 / 10;
        var level = coefficient * wfreq

        
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

       
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';

        var path = mainPath.concat(pathX, space, pathY, pathEnd);

        var data = [{
            type: 'scatter',
            x: [0], y: [0],
            marker: { size: 20, color: '#BF0803' },
            showlegend: false,
            name: 'Washing Frequency',
            text: wfreq,
            hoverinfo: 'text+name'
        },
        {
            values: [5 / 5, 5 / 5, 5 / 5, 5 / 5, 5 / 5, 5],
            rotation: 90,
            text: ['Frequently', 'Above-Average', 'Average', 'Below-Average',
                'Seldom', ''],
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: ['#459373', '#6EAB92',
                    '#97C3B1', '#C1DBD0',
                    '#EAF3EF',
                    'rgb(255,255,255']
            },
            labels: ['8-10', '6-8', '4-6', '2-4', '0-2', ''],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
        }];

        var layout = {
            shapes: [{
                type: 'path',
                path: path,
                fillcolor: '#BF0803',
                line: {
                    color: '#BF0803'
                }
            }],
            font: {family:"Balto"},
            height: 500,
            width: 400,
            xaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            },
            yaxis: {
                zeroline: false, showticklabels: false,
                showgrid: false, range: [-1, 1]
            }
        };

        Plotly.newPlot('plotGauge', data, layout);

    });

    var urlBubble = "/samples/BB_940";
    Plotly.d3.json(urlBubble, function (error, initDataBubble) {
        if (error) return console.warn(error)

        var trace1 = {
            x: Object.values(initDataBubble.otu_ids),
            y: Object.values(initDataBubble.sample_values),
            mode: 'markers',
            marker: {
              size: Object.values(initDataBubble.sample_values),
              color: Object.values(initDataBubble.otu_ids)
            }
          };
          
          var data = [trace1];
          
          var layout = {

            font: {family:"Balto"},
            showlegend: false,
            xaxis:{
                title : "OTU(Operational Taxonomic Unit) ID"
            },

            yaxis:{
                title : "Sample Values"
            },
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('plotBubble', data, layout);

    });




};

 
function dropDown() {
    var url = "/names";

    var list = Plotly.d3.select("#sampleList").append('select').attr("onchange", "getValue()")

    Plotly.d3.json(url, function (error, namesList) {
        if (error) return console.warn(error)

        list.selectAll('option')
            .data(namesList)
            .enter()
            .append('option')
            .text(function (d) { return d; });
    });
}


function gaugeChart(wfreq) {

    

    const coefficient = 180 / 10;
    var level = coefficient * wfreq

    
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';

    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
        type: 'scatter',
        x: [0], y: [0],
        marker: { size: 20, color: '#BF0803' },
        showlegend: false,
        name: 'Washing Frequency',
        text: wfreq,
        hoverinfo: 'text+name'
    },
    {
        values: [5 / 5, 5 / 5, 5 / 5, 5 / 5, 5 / 5, 5],
        rotation: 90,
        text: ['Frequently', 'Above-Average', 'Average', 'Below-Average',
            'Seldom', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['#459373', '#6EAB92',
            '#97C3B1', '#C1DBD0',
            '#EAF3EF',
            'rgb(255,255,255']
        },
        labels: ['8-10', '6-8', '4-6', '2-4', '0-2', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '#BF0803',
            line: {
                color: '#BF0803'
            }
        }],

        height: 500,
        width: 400,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        }
    };

    Plotly.newPlot('plotGauge', data, layout);

}


init();
