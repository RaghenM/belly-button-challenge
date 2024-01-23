// // Set up URL for data

let queryUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Retrieve the JSON data console log it
d3.json(queryUrl).then(function(data) {
//console log it so we can look at the JSON
    console.log(data);
});

// Funtion for dropdown, bar chart, bubble chart with sample data
function init(){
    //create the dropdown list variable for all sample id's in the dataset
    let dropdown = d3.select("#selDataset");
    //access sample data using d3
    //Arrow function allows up to drop the function keyword and just show the parameters
    d3.json(queryUrl).then((data) => {
    //gather the sample ids from the names list in data and populate the dropdown
    let s_ids = data.names;
    //view ID's in the log
    console.log(s_ids);
        for (id of s_ids){
           // append each ID as a new value
            dropdown.append("option").attr("value", id).text(id);
        };
    //store the first sample for display initialization
    let first_record = s_ids[0];
    //view in the log
    console.log(first_record);
    
    //have the init() function call the graph generating functions with the first record (id 940)
    makeBar(first_record);
    makeBubble(first_record);
    makeDemographics(first_record);
    }); 
};

//Function to populate the horizontal bar chart graph
function makeBar(sample){

    //access the sample data for populating the bar chart
    d3.json(queryUrl).then((data) => {
        let sample_data = data.samples;
        //apply a filter that matches based on s_ids
        let results = sample_data.filter(id => id.id == sample);
        //access and store the first entry in results filter
        let first_result = results[0];
        //view result in the log
        console.log(first_result);
        //Instructions say to display the top 10 OTU's: store the first 10 results to display in the bar chart
        //slice returns elements at index 0-9
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

              //trace for bar chart
              let bar_chart_trace = {
                x: sample_values.reverse(),
                y: otu_ids.map(item => `OTU ${item}`).reverse(),
                text: otu_labels.reverse(),
                type: 'bar',
                //make horiztonal to match the chart in the instructions 
                orientation: 'h',
                //make bars red
                marker: {
                    color: 'red'
                }
                
            };
    
            let layout = {title: "Top Ten Operational Taxonomic Units (OTUs)"};
             //'bubble' is the html div tag assigned in the index.html file
            Plotly.newPlot("bar", [bar_chart_trace], layout);
        });
    };

    function makeBubble(sample){
        //access the sample data for populating the bubble chart
        d3.json(queryUrl).then((data) => {
            let sample_data = data.samples;
            //apply a filter that matches based on s_ids
            let results = sample_data.filter(id => id.id == sample);
            //access and store the first entry in results filter
            let first_result = results[0];
            //view results in the log
            console.log(first_result);
            //store the results to display in the bubble chart
            let sample_values = first_result.sample_values;
            let otu_ids = first_result.otu_ids;
            let otu_labels = first_result.otu_labels;
            console.log(sample_values);
            console.log(otu_ids);
            console.log(otu_labels);
    
            // trace for bubble chart
            let bubble_chart_trace = {
                x: otu_ids.reverse(),
                y: sample_values.reverse(),
                text: otu_labels.reverse(),
                mode: 'markers',
                marker: {
                    size: sample_values,
                    color: otu_ids,
                }
            };
            //add chart and axis info 
            let layout = {
                title: "Bacteria Count per ID",
                xaxis: {title: 'OTU ID'},
                yaxis: {title: 'Count of Bacteria'}
            };
            //'bubble' is the html div tag assigned in the index.html file
            Plotly.newPlot("bubble", [bubble_chart_trace], layout); 
        });
    };

    //function to populate each sample's info
function makeDemographics(sample){
    //access the sample data for populating the demographics section
    d3.json(queryUrl).then((data) => {
    //access the metadata using d3
    let demographic_metadata = data.metadata;
     //apply a filter that matches based on sample id
    let results = demographic_metadata.filter(id => id.id == sample);
    //store the first result to display (data in a list so need index)
    let first_result = results[0];
    //view 1st result in the log
    console.log(first_result);
    //clear out previous entries (set text to a blank string)
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key,value]) => {
        console.log(key,value);
        //select the demographic info html section with d3 and append new key-value pair
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

 //define the function when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value){
    //log the value for debug
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();

