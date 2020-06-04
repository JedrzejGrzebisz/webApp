<?php

$ledDisplay = array();
$ledDisplayFile = fopen("singleLedColor.json", w);

$ledDisplay['row'] = (int)($_GET['row']);
$ledDisplay['column'] = (int)($_GET['column']);
$ledDisplay['color'] = $_GET['color'];

$ledDisplayJson = json_encode($ledDisplay);
fwrite($ledDisplayFile, $ledDisplayJson);
fclose($ledDisplayFile);

exec('sudo ./singleLedColor.py');

?>