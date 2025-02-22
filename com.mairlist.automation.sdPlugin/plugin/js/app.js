// Main function, connection handling to SD
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
  var upstream = null;

  // Open the web socket
  const websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  websocket.onopen = function() {
    // Register
    websocket.send(JSON.stringify({
      "event": inRegisterEvent,
      "uuid": inPluginUUID
    }));
    
    // Create upstream connection
    upstream = new UpstreamConnection(function(payload) {
      websocket.send(JSON.stringify(payload));
    });

    // Request global settings
    websocket.send(JSON.stringify({
      "event": "getGlobalSettings",
      "context": inPluginUUID
    }));
  };

  websocket.onmessage = function (evt) {
  
    var data = JSON.parse(evt.data);
    
    if (data.event == "willAppear") {
      upstream.willAppear(data);
    }
    else if (data.event == "willDisappear") {
      upstream.willDisapper(data);
    }
    else if (data.event == "keyDown") {
      upstream.keyDown(data);
    }
    else if (data.event == "keyUp") {
      upstream.keyUp(data);
    }
    else if (data.event == "didReceiveSettings") {
      upstream.didReceiveSettings(data);
    }
    else if (data.event == "didReceiveGlobalSettings") {
      upstream.didReceiveGlobalSettings(data.payload.settings);
    }
  };

  websocket.onclose = function()  { 
    if (upstreamConnected) {
      shuttingDown = true;
      upstream.shutdown();
    }
  };
}

