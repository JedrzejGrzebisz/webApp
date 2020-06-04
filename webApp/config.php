<?php

$oldSampleTimeMsec = 1000;
$oldMaxSamplesNumber = 100;

$config = array();
$configFile = fopen("config.json", w);
/*
if (filesize("config.json"))
{
	$oldConfigJson = file_get_contents("config.json");
	$oldConfig = json_decode($oldConfigJson, true);
	$oldSampleTimeMsec = $oldConfig['sampleTimeMsec'];
	$oldMaxSamplesNumber = $oldConfig['maxSamplesNumber'];
}

if (!(is_null($_GET['sampleTimeMsc'])))
{
	$config['sampleTimeMsec'] = $_GET['sampleTimeMsc'];
}
else
{
	$config['sampleTimeMsec'] = $oldSampleTimeMsec;
}
if (!(is_null($config['maxSamplesNumber'])))
{
	$config['maxSamplesNumber'] = $_GET['maxSamplesNb'];
}
else
{
	$config['maxSamplesNumber'] = $oldMaxSamplesNumber;
}	
*/

$config['sampleTimeMsec'] = $_GET['sampleTimeMsc'];
$config['maxSamplesNumber'] = $_GET['maxSamplesNb'];

$configJson = json_encode($config);
fwrite($configFile, $configJson);
fclose($configFile);

?>