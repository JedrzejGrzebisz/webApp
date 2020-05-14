<?php

$ledDisplay = array();
$ledDisplayFile = fopen("textLedColor.json", w);

$ledDisplay['text'] = $_GET['text'];
$ledDisplay['color'] = $_GET['color'];

$ledDisplayJson = json_encode($ledDisplay);
fwrite($ledDisplayFile, $ledDisplayJson);
fclose($ledDisplayFile);

exec('sudo ./textLedColor.py');

?>