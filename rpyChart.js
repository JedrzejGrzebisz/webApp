const sampleTimeSec = 1; 					// sample time in sec
const sampleTimeMsec = 1000*sampleTimeSec;	// sample time in msec
const maxSamplesNumber = 100;				// maximum number of samples

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
						labelString: 'Time [s]'
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
	$("#sampletime").text(sampleTimeMsec.toString());
	$("#samplenumber").text(maxSamplesNumber.toString());
});