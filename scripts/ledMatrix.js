let urlAddress;
let dataDict; 

function ajaxSend(event) 
{
    if (event.data.type == "single")
    {
        urlAddress = 'webApp/singleLedColor.php'
        dataDict = {
             row: $('#rowNumber').val(),
             column: $('#columnNumber').val(),
             color: $('#singleLedColor').val()
        }   
    }
    else if (event.data.type == "text")
    {
        urlAddress = 'webApp/textLedColor.php'
        dataDict = {
            text: $('#textLed').val(),
            color: $('#textLedColor').val()
       }  
    }

	$.ajax({
        type: 'GET',
        url: urlAddress,
        data: dataDict,
		success: function(response) {
            console.log("Done");
            console.log(dataDict);
		}
	});
}

$(document).ready(() => { 
	$('#singleLedButton').click({type: "single"} ,ajaxSend);
    $('#textLedButton').click({type: "text"} ,ajaxSend);
});