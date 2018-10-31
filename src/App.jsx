import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';

// in-memory user and message data object
import MessageData from './MessageData.json'

// display loading message during delay simulation on initial render
function Loading(){
  return (
    <h1>Loading Tasks...</h1>
  );
}

function NavBar(){
  return (
  <nav className="navbar">
  <a href="/" className="navbar-brand">Chatty</a>
  </nav>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = { 
      loading: true, 
      messages: [],
      currentUser: {name: "Bob"}
    }
    this.updateMessages = this.updateMessages.bind(this);

    // websocket setup and connection
    const socketServerURL = "ws://localhost:3001"
    this.socket = new WebSocket(socketServerURL);
  }
  
  updateMessages(newMessage){
      const messageBody = { 
        // id: this.state.messages.length + 1,
        // type: "incomingMessage",
        content: newMessage,
        username: this.state.currentUser
      }
      this.socket.send(JSON.stringify(messageBody));
      // const newMessageData = this.state.messages.concat(messageBody)
      // this.setState({messages: newMessageData});
    }


  componentDidMount() {
    // simulate delay for initial app loading
    setTimeout(() => {
      this.setState(
        {loading: false})
      }, 1000);

    // socket connection to web server
    this.socket.onopen = () => {
      console.log("Connected to Server");
    };

    this.socket.onmessage = () => {
      console.log(event.data);
    }
  }
  
  render() {
    return (
      <div>
        {this.state.loading ? <Loading /> :
          <div>
          <NavBar />
          <ChatBar currentUser={this.state.currentUser} 
                   updateMessages={this.updateMessages} />
          <Message />
          <MessageList messageList={this.state.messages}/>
          </div>
        }
      </div>
    );
  }
}

export default App