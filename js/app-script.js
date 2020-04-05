// startScript("canvas1");

function startScript(canvasId)
{
	//alert('hi');
	console.log('start');
	var isRecording = false;
	playbackInterruptCommand = "";
	
	// $(document).bind("ready", function() {

		// alert('ok');
		console.log('hiya')
		//$("#pauseBtn").hide();
		//$("#playBtn").hide();
		
		drawing = new RecordableDrawing(canvasId);
		
		$("#recordBtn").click(function(){
			var btnTxt = $("#recordBtn").prop("value");
			if (btnTxt == 'Stop')
				// console.log('ask stop')
				stopRecording();
			else
				startRecording();
		});
		
		$("#playBtn").click(playRecordings);

		function playRecordings()
		{
			if (drawing.recordings.length == 0)
			{
				alert("No recording to play");
				return;
			}
			var btnTxt = $("#playBtn").prop("value");
			if (btnTxt == 'Stop')
				stopPlayback();
			else
				startPlayback();			
		}
		
		$("#pauseBtn").click(function(){
			var btnTxt = $("#pauseBtn").prop("value");
			if (btnTxt == 'Pause')
			{
				if (isRecording)
					pauseRecording();
				else
					pausePlayback();
			} else if (btnTxt == 'Resume')
			{
				if (isRecording)
					resumeRecording();
				else
					resumePlayback();
			}
		});
		$("#clearBtn").click(function(){
			drawing.clearCanvas();			
		});
	
		$("#serializeBtn").click(function() {
			var serResult = serializeDrawing(drawing);
			if (serResult != null)
			{
				doSend(serResult);
				// $("#serDataTxt").val(serResult);
				// showSerializerDiv();
			} else
			{
				alert("Error serializing data");
			}
		});

		function showSerializerDiv(showSubmit)
		{
			$("#drawingDiv").hide();
			$("#canvasBtnsDiv").hide();
			$("#serializerDiv").show();	
			if (showSubmit)
				$("#okBtn").show();
			else
				$("#okBtn").hide();
		}

		function hideSerializerDiv()
		{
			$("#drawingDiv").show();
			$("#canvasBtnsDiv").show();
			$("#serializerDiv").hide();	
		}

		$("#deserializeBtn").click(function(){
			showSerializerDiv(true);
		});

		$("#cancelBtn").click(function(){
			hideSerializerDiv();
		});

		$("#okBtn").click(function(){
			var serTxt = $("#serDataTxt").val();
			var result = deserializeDrawing(serTxt);
			if (result == null)
				result = "Error : Unknown error in deserializing the data";
			if (result instanceof Array == false)
			{
				$("#serDataTxt").val(result.toString());
				showSerializerDiv(false);
				return;
			} 
			else
			{
				//data is successfully deserialize
				drawing.recordings = result;
				//set drawing property of each recording
				for (var i = 0; i < result.length; i++)
					result[i].drawing = drawing;
				hideSerializerDiv();
				playRecordings();
			}
		});
		
		$("#colorsDiv .colorbox").click(function(){
			$("#colorsDiv .colorbox").removeClass("selectedColor");
			$(this).addClass("selectedColor");
			drawing.setColor($(this).css("background-color"));
		});
		
		$(".stroke").click(function(){
			$(".stroke_selected").removeClass("stroke_selected");
			$(this).addClass("stroke_selected");
			var size = $(this).css("border-radius");
			drawing.setStokeSize(parseInt(size));
		});
		
		var size = parseInt($(".stroke_selected").css("border-radius"));
		if (size > 0)
			drawing.setStokeSize(size);
	// });
	
	function stopRecording()
	{
		console.log('stop rec')
		$("#recordBtn").prop("value","Record");
		$("#playBtn").show();
		$("#pauseBtn").hide();
		$("#clearBtn").show();
		
		drawing.stopRecording();
		isRecording = false;
	}
	
	function startRecording()
	{
		console.log('start rec')
		$("#recordBtn").prop("value","Stop");
		$("#playBtn").hide();
		$("#pauseBtn").show();
		$("#clearBtn").hide();
		
		drawing.startRecording();
		isRecording = true;
		//set curent color
		var color = $("#colorsDiv .selectedColor").css("background-color");
		var strokesize = parseInt($(".stroke_selected").css("border-radius"));
		drawing.setColor(color);
		drawing.setStokeSize(strokesize);
	}
	
	function stopPlayback()
	{
		playbackInterruptCommand = "stop";		
	}
	
	function startPlayback()
	{
		var currColor = $("#colorsDiv .selectedColor").css("background-color");
		var currStrokeSize = parseInt($(".stroke_selected").css("border-radius"));
		
		drawing.playRecording(function() {
			//on playback start
			$("#playBtn").prop("value","Stop");
			$("#recordBtn").hide();
			$("#pauseBtn").show();
			$("#clearBtn").hide();
			playbackInterruptCommand = "";
		}, function(){
			//on playback end
			$("#playBtn").prop("value","Play");
			$("#playBtn").show();
			$("#recordBtn").show();
			$("#pauseBtn").hide();
			$("#clearBtn").show();
			if (currColor && currColor != "")
				drawing.setColor(currColor);
			if (currStrokeSize > 0)
				drawing.setStokeSize(currStrokeSize);
		}, function() {
			//on pause
			$("#pauseBtn").prop("value","Resume");
			$("#recordBtn").hide();
			$("#playBtn").hide();
			$("#clearBtn").hide();
		}, function() {
			//status callback
			return playbackInterruptCommand;
		});
	}
	
	function pausePlayback()
	{
		playbackInterruptCommand = "pause";
	}
	
	function resumePlayback()
	{
		playbackInterruptCommand = "";
		drawing.resumePlayback(function(){
			$("#pauseBtn").prop("value","Pause");
			$("#pauseBtn").show();
			$("#recordBtn").hide();
			$("#playBtn").show();
			$("#clearBtn").hide();
		});
	}
	
	function pauseRecording()
	{
		drawing.pauseRecording();
		$("#pauseBtn").prop("value","Resume");
	}
	
	function resumeRecording()
	{
		drawing.resumeRecording();
		$("#pauseBtn").prop("value","Pause");
	}
}

