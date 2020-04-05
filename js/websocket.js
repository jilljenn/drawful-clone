var lastMessage;

function makeMessage(n) {
	return 'a'.repeat(n);
}

function initDrawful()
{
    /* document.myform.url.value = "ws://trioelm.com:4248/"
       document.myform.inputtext.value = "1"
       document.myform.disconnectButton.disabled = true; */
    // initRanking();
    // initFilter();
    doConnect();
	console.log('what');
	startScript('canvas1');
    // videos.arrange({ filter: '.featured' });
    // document.querySelector('.quicksearch').focus();
}

function doConnect()
{
    // websocket = new WebSocket(document.myform.url.value, ['vote']);
    websocket = new WebSocket('wss://jiji.cat:2020/');
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
    writeToScreen("connected\n");
    /* document.myform.connectButton.disabled = true;
       document.myform.disconnectButton.disabled = false; */
}

function onClose(evt)
{
    writeToScreen("disconnected\n");
    /* document.myform.connectButton.disabled = false;
    document.myform.disconnectButton.disabled = true; */
}

function onMessage(evt)
{
    writeToScreen("response: " + evt.data.length + ' bytes\n');
	deserializeDrawing(JSON.parse(evt.data));
	lastMessage = JSON.parse(evt.data);
	/* evt.data.split(',').forEach(function(v, i) {
       document.getElementById('v' + i).innerText = v;
       }); */
    // rerank();
}

function onError(evt)
{
    writeToScreen('error: ' + evt.data + '\n');

    websocket.close();

    /* document.myform.connectButton.disabled = false;
    document.myform.disconnectButton.disabled = true; */
}

function doSend(message)
{
    writeToScreen("sent: " + message.length + ' bytes\n'); 
    websocket.send(message);
}

function writeToScreen(message)
{
    $('#debug').val(message);
    console.log(message);
    /* document.myform.outputtext.value += message
    document.myform.outputtext.scrollTop = document.myform.outputtext.scrollHeight; */
}

// window.addEventListener("load", init, false);


function sendText() {
    doSend( document.myform.inputtext.value );
}

function clearText() {
    document.myform.outputtext.value = "";
}

function doDisconnect() {
    websocket.close();
}
