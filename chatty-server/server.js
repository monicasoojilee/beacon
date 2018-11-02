//--------------- MIDDLEWARE SETUP ---------------//
const PORT = 3001;
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');


//--------------- EXPRESS SERVER ---------------//
const server = express()
   // Make the express server serve static assets (HTML, JS, CSS) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));


//--------------- WEBSOCKET SERVER ---------------//
const wss = new SocketServer({ server });

const colourArr = ["#B71212", "#7B12B7", "#07729F", "#DE781E"];

// ON CONNECT (+ assigned a socket(ws))
wss.on('connection', (ws) => {
  console.log('Client connected');

  let randomColour = colourArr[(Math.floor((Math.random() * 4)))];

  wss.clients.forEach(client => {
    let usersOnline = {
      type: "numOfUsers",
      totalNum: wss.clients.size
    }
    client.send(JSON.stringify(usersOnline));
  });

// ON MESSAGE
  ws.on('message', function incoming(event) {
    const clientData = JSON.parse(event);
    
    switch(clientData.type) {
    
      case "notifyMessage":
      const usernameWithId = {
        type: "incomingNotification",
        id: uuidv4(),
        username: clientData.currentUser.name,
        content: clientData.content
      }
      wss.clients.forEach(client => {
        client.send(JSON.stringify(usernameWithId));
      });
      break;

      case "postMessage":
      const messageWithId = {
        type: "incomingMessage",
        id: uuidv4(),
        username: clientData.username.name,
        content: clientData.content,
        colour: randomColour
      }
      wss.clients.forEach(client => {
        client.send(JSON.stringify(messageWithId));
      });
      break;
    }
  });
    
    // ON DISCONNECT
    ws.on('close', () => {
      console.log('Client disconnected');
      wss.clients.forEach(client => {
        let usersOnline = {
          type: "numOfUsers",
          totalNum: wss.clients.size
        }
        client.send(JSON.stringify(usersOnline));
      });
  });
});