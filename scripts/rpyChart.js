const defaultSampleTimeSec = 1; 					// default sample time in sec
const defaultSampleTimeMsec = 1000*defaultSampleTimeSec;	// default sample time in msec
const defaultMaxSamplesNumber = 100;				// default maximum number of samples

let sampleTimeSec = defaultSampleTimeSec; // sample time in sec
let sampleTimeMsec = defaultSampleTimeMsec; // sample time is msc
let maxSamplesNumber = defaultMaxSamplesNumber;	//maximum number of samples
let xd = 10;

let xData; // x-axis array: time
let yRollData; // y-axis array: roll
let yPitchData; // y-axis array: pitch
let yYawData; // y-axis array: yaw
let lastTimeStamp; // recent time stamp 

let myChartCtx;  // myChart context
let myChart; // Chart.js object

let timer; // request timer

const urlDefault = 'http://192.168.56.22/webApp/rpyValue.json'; // server app with JSON API

/**
* @brief Set selected sample time and maximum number of samples
*/
function setSettings()
{
	if ($('#sampleTime').val())
	{
		sampleTimeMsec = parseInt($('#sampleTime').val());
		sampleTimeSec = sampleTimeMsec/1000;
		$("#sampletime").text(sampleTimeMsec.toString());
	}
	if ($('#maxSamplesNumber').val())
	{
		maxSamplesNumber = parseInt($('#maxSamplesNumber').val());
		$("#samplenumber").text(maxSamplesNumber.toString());
	}
}

/**
* @brief Add new values to next data point.
* @param r New y-axis roll value
* @param p New y-axis pitch value 
* @param y New y-axis yaw value 
*/
function addData(r, p, y)
{
	if(yRollData.length > maxSamplesNumber) // same length of roll, pitch, yaw
	{
		removeOldData();
		lastTimeStamp += sampleTimeSec;
		xData.push(lastTimeStamp.toFixed(4));
	}
    yRollData.push(r);
    yPitchData.push(p);
    yYawData.push(y);
	myChart.update();
}

/**
* @brief Remove oldest data point.
*/
function removeOldData()
{
	xData.splice(0,1);
    yRollData.splice(0,1);
    yPitchData.splice(0,1);
    yYawData.splice(0,1);
}

/**
* @brief Start request timer
*/
function startTimer()
{
	timer = setInterval(ajaxJSON, sampleTimeMsec);
}

/**
* @brief Stop request timer
*/
function stopTimer()
{
	clearInterval(timer);
}

/**
* @brief Send HTTP GET request to IoT server
*/
function ajaxJSON() 
{
	$.ajax(urlDefault, {
		type: 'GET', dataType: 'json',
		success: function(responseJSON, status, xhr) {
			addData(+responseJSON.Roll, +responseJSON.Pitch, +responseJSON.Yaw);
		}
	});
}

/**
* @brief Chart initialization
*/
function chartInit()
{
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xData = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xData.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xData);

	// last value of 'xData'
	lastTimeStamp = +xData[xData.length-1]; 

	// empty arrays for rpy values
	yRollData = [];
	yPitchData = []; 	
    yYawData = [];
    
	// get chart context from 'canvas' element
	myChartCtx = $("#chart")[0].getContext('2d');

	myChart = new Chart(myChartCtx, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xData' as labels, 'y(RPY)data' as dataset.data
        data: 
        {
			labels: xData,
			datasets: [{
                label: 'Roll',
                data: yRollData,
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
                fill: false,
                borderWidth: 1
			}, {
				label: 'Pitch',
                data: yPitchData,
				backgroundColor: 'rgb(128, 0, 128)',
				borderColor: 'rgb(128, 0, 128)',
                fill: false,
                borderWidth: 1
			}, {
				label: 'Yaw',
                data: yYawData,
				backgroundColor: 'rgb(255, 255, 0)',
				borderColor: 'rgb(255, 255, 0)',
                fill: false,
                borderWidth: 1
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Radians'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Sample'
					}
				}]
			}
		}
	});
	
    yRollData = myChart.data.datasets[0].data;
    yPitchData = myChart.data.datasets[1].data;
    yYawData = myChart.data.datasets[2].data;
	xData = myChart.data.labels;
}

$(document).ready(() => { 
	chartInit();
	$("#start").click(startTimer);
	$("#stop").click(stopTimer);
	$("#saveSettings").click(setSettings);
	$("#sampletime").text(defaultSampleTimeMsec.toString());
	$("#samplenumber").text(defaultMaxSamplesNumber.toString());
});