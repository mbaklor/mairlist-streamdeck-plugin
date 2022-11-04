// this is our global websocket, used to communicate from/to Stream Deck software
// and some info about our plugin, as sent by Stream Deck software
var websocket = null,
uuid = null,
actionInfo = {};
settings = {};

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
	uuid = inUUID;
	// please note: the incoming arguments are of type STRING, so
	// in case of the inActionInfo, we must parse it into JSON first
	actionInfo = JSON.parse(inActionInfo); // cache the info
	settings = actionInfo.payload.settings;
	websocket = new WebSocket('ws://127.0.0.1:' + inPort);
	
	if (settings.cartNumber != undefined) {
		document.getElementById("cartNumber").value = settings.cartNumber;
	}

	// if connection was established, the websocket sends
	// an 'onopen' event, where we need to register our PI
	websocket.onopen = function () {
		var json = {
			event:  inRegisterEvent,
			uuid:   inUUID
		};
		// register property inspector to Stream Deck
		websocket.send(JSON.stringify(json));
	}
}

// our method to pass values to the plugin
function sendValueToPlugin(value, param) {
	if (websocket) {
		const json = {
				"action": actionInfo['action'],
				"event": "sendToPlugin",
				"context": uuid,
				"payload": {
					[param] : value
				}
		 };
		 websocket.send(JSON.stringify(json));
	}
}

function updateSettings() {
	settings.cartNumber = document.getElementById("cartNumber").value;
	
	const json = {
			"event": "setSettings",
			"context": uuid,
			"payload": settings
	 };
	 websocket.send(JSON.stringify(json));
}