// handles when 'upload new picture' is pressed
UIkit.upload('.js-upload', {
    url: '/myprofile/uploadnewpicture',
    multiple: false,

    completeAll: function () {
        console.log('completeAll', arguments);
    }
});

var temperaturChart;
var luftFugtighedsChart;
var lysChart;
var combinedChart;
var charts;

function waterplant() {
    fetch(window.location.origin + '/waterplant', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'text/plain',
        },
        body: 'vand plante',
    })
        .then(response => response)
        .then(data => {
            console.log('Planten vandes nu.');
        })
        .catch((error) => {
            console.error('Der gik noget galt:', error);
        });
}

function insertDataHTML(data) {
    document.getElementById("temperatur").innerHTML = " " + data[0][data[0].length - 1]
    document.getElementById("luftFugtighed").innerHTML = " " + data[1][data[1].length - 1]
    document.getElementById("lys").innerHTML = " " + data[2][data[2].length - 1]
}

function createCharts(labels, data) {
    temperaturChart = new smallChart('canvasTemperatur', 'Temperatur', 'rgb(255, 20, 20)');
    temperaturChart.fillWithData(labels, data[0]);

    luftFugtighedsChart = new smallChart('canvasLuft', 'Luftfugtighed', 'rgb(20, 20, 255)');
    luftFugtighedsChart.fillWithData(labels, data[1]);

    lysChart = new smallChart('canvasLys', 'Lysniveau', 'rgb(220, 220, 20)');
    lysChart.fillWithData(labels, data[2]);

    combinedChart = new bigChart('myChart', [], [], []);
    combinedChart.chart.data.labels = labels;
    combinedChart.chart.update();

    charts = [temperaturChart, luftFugtighedsChart, lysChart];
}

function clickOnCanvas(can) {
    let add = true;
    for (let i = 0; i < charts.length; i++) {
        if (charts[i].id == can.id) {
            for (let x = 0; x < combinedChart.addedCharts.length; x++) {
                if (charts[i].id == combinedChart.addedCharts[x]) {
                    add = false;
                    // remove dataset from big chart / combined chart
                    // remove the dataset
                    let index = combinedChart.datasets.indexOf(charts[i].chart.data.datasets[0].data);
                    if (index !== -1) combinedChart.datasets.splice(index, 1);

                    // remove the name
                    index = combinedChart.addedCharts.indexOf(charts[i].id);
                    if (index !== -1) combinedChart.labels.splice(index, 1);

                    // remove the color
                    index = combinedChart.colors.indexOf(charts[i].chart.data.datasets[0].borderColor);
                    if (index !== -1) combinedChart.colors.splice(index, 1);

                    // remove the id from the list of added charts
                    index = combinedChart.addedCharts.indexOf(charts[i].id);
                    if (index !== -1) combinedChart.addedCharts.splice(index, 1);


                    break;
                }
            }
            if (add) {
                // add dataset to combinedchart
                combinedChart.datasets.push(charts[i].chart.data.datasets[0].data);
                combinedChart.labels.push(charts[i].name);
                combinedChart.colors.push(charts[i].chart.data.datasets[0].borderColor);
                combinedChart.addedCharts.push(charts[i].id);

            }


            break;
        }

    }
    console.log(combinedChart);

    // set shittet ind
    combinedChart.addDataset();
    combinedChart.chart.update();

}

class smallChart {
    constructor(id, name, rgb) {
        this.id = id;
        this.name = name;
        this.ctx = document.getElementById(id).getContext('2d');
        this.chart = new Chart(this.ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: name,
                    borderColor: rgb,
                    data: []
                }]
            },

            // Configuration options go here
            options: {

                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear',
                        time: {
                            displayFormats: {
                                minute: 'HH:mm',
                            },
                            unit: 'minute',
                        }
                    }],



                },
                elements: {
                    point: {
                        radius: 0
                    }
                }
            },
        });
    }

    fillWithData(labels, data) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
}

class bigChart {
    constructor(id, labels, datasets, colors) {
        this.id = id;
        this.labels = labels;
        this.datasets = datasets;
        this.addedCharts = [];
        this.colors = colors;
        this.ctx = document.getElementById(id).getContext('2d');
        this.chart = new Chart(this.ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: [],

            // Configuration options go here
            options: {

                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear',
                        time: {
                            displayFormats: {
                                minute: 'HH:mm',
                            },
                            unit: 'minute',
                        }
                    }],



                },
                elements: {
                    point: {
                        radius: 0,
                    }
                }
            }
        });
    }

    addDataset() {
        this.chart.data.datasets = [];
        for (let i = 0; i < this.datasets.length; i++) {
            this.chart.data.datasets.push({
                label: this.labels[i],
                borderColor: this.colors[i],
                data: this.datasets[i],
            });


        }
        this.chart.update();
    }
}

// get data from server
let labels = [];
let data = [[], [], []];

fetch(window.location.origin + '/database')
    .then((response) => {
        return response.json();

    })
    .then((database) => {
        // make response to json
        jsonData = JSON.parse(database);
        // sort data from json
        for (let element of jsonData) {
            // get timestamp from json
            let timestamp = element['Timestamp'];
            timestamp = moment.unix(timestamp);
            labels.push(timestamp);

            let temperature = element['Temperature'];
            let fugtighed = element['Humidity'];
            let lys = element['Lightsensitivity'];

            data[0].push(temperature);
            data[1].push(fugtighed);
            data[2].push(Math.round((lys / 1023) * 100));
        }
        // clear loading space
        let smallCanvasHolder = document.getElementById('smallCanvasHolder');
        smallCanvasHolder.innerHTML = '';

        let canvasHolder = document.getElementById('canvasHolder');
        canvasHolder.innerHTML = '';

        // make canvases
        smallCanvasHolder.innerHTML = `
            <div>
                <canvas onclick="clickOnCanvas(this);" id="canvasTemperatur" style="height: 218px;"></canvas>
            </div>
            <div>
                <canvas onclick="clickOnCanvas(this);" id="canvasLys" style="height: 218px;"></canvas>
            </div>
            <div>
                <canvas onclick="clickOnCanvas(this);" id="canvasLuft" style="height: 218px;"></canvas>
            </div>
            <div>
                <canvas onclick="clickOnCanvas(this);" id="canvasJord" style="height: 218px;"></canvas>
            </div>
            <div>
                <canvas onclick="clickOnCanvas(this);" id="canvasVand" style="height: 218px;"></canvas>
            </div>`;

        canvasHolder.innerHTML = `
            <canvas style="width: 100%; height: 480px;" id="myChart"></canvas>
        `;
        console.log('Det burde virke nu');


        // create the charts
        insertDataHTML(data);
        createCharts(labels, data);
    });


