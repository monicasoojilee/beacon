import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';

// display loading message during delay simulation on initial render
function Loading(){
  return (
    <h1>Loading Tasks...</h1>
  );
}

function NavBar(props){
  return (
  <nav className="navbar">
  <a href="/" className="navbar-brand">Chatty</a>
  <label>Number of Users:{props.numOfUsers}</label>
  </nav>
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = { 
      loading: true, 
      messages: [],
      currentUser: {name: "Anonymous"},
      numOfUsers: 0
    }
    this.updateMessages = this.updateMessages.bind(this);
    this.updateUsername = this.updateUsername.bind(this);

    // websocket setup and connection
    const socketServerURL = "ws://localhost:3001"
    this.socket = new WebSocket(socketServerURL);
  }

  // REQUEST (new username): client ---> server
  updateUsername(newUsername){
    const usernameBody = {
      type: "notifyMessage",
      content: `${this.state.currentUser.name} changed their name to ${newUsername}`,
      currentUser: {name: newUsername}
    }
    this.setState({currentUser: {name: newUsername}})
    this.socket.send(JSON.stringify(usernameBody))
  }

  // REQUEST (new message): client ---> server
  updateMessages(newMessage){
      const messageBody = {
        type: "postMessage",
        content: newMessage,
        username: this.state.currentUser
      }
      this.socket.send(JSON.stringify(messageBody));
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

    // RESPONSE: client <--- server
    this.socket.onmessage = (event) => {
      const serverData = JSON.parse(event.data);
      console.log("serverData -onmessage: ", serverData);
      if (serverData.type === "numOfUsers") {
        const usersOnline = serverData.totalNum;
        console.log("PREV numOfUsers state: ", this.state.numOfUsers);
        this.setState({numOfUsers: usersOnline});
        console.log("UPDATE numOfUsers state", this.state.numOfUsers);
      } else {
        const messages = this.state.messages.concat(serverData);
        this.setState({messages: messages});
      }
    }
  }
  
  render() {
    return (
      <div>
        {this.state.loading ? <Loading /> :
          <div>
          <NavBar numOfUsers={this.state.numOfUsers}/>
          <ChatBar currentUser={this.state.currentUser} 
                   updateUsername={this.updateUsername}
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