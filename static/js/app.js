function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metaURL = `/metadata/${sample}`;

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metaURL).then(function(response) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      var panelData = panel.append("p");
      panelData.text(`${key}: ${value}`);
    });

    // Create Gauge plot
    var wfreq = response['WFREQ'];

    buildGauge(wfreq)
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleURL = `/samples/${sample}`;

    // @TODO: Build a Bubble Chart using the sample data

  d3.json(sampleURL).then(function(response) {

    var otuIds = response['otu_ids'];
    var sampleValues = response['sample_values'];
    var otuLabels = response['otu_labels'];

    var trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
      },
      text: otuLabels,
      type: 'scatter'   
    };

    var layout = {
      title: `All Data for Sample ${sample}`,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Sample Values'
      }
    };

    var dataBubble = [trace1];

    Plotly.newPlot("bubble", dataBubble, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var otuIds_10 = response['otu_ids'].slice(0, 10);
    var sampleValues_10 = response['sample_values'].slice(0, 10);
    var otuLabels_10 = response['otu_labels'].slice(0, 10);

    var trace2 = {
      values: sampleValues_10,
      labels: otuIds_10,
      text: otuLabels_10,
      type: 'pie',
      textinfo: 'none'
    };

    var layout = {
      title: `Top 10 Samples for Sample ${sample}`
    }

    var dataPie = [trace2];

    Plotly.newPlot("pie", dataPie, layout)
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
