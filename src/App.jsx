// IMPORT - all components/features for the main application
import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

// RENDER - simulated delay loading message on initial render
function Loading(){
  return (
      <div>
      <h1>Lighting the beacon</h1>
      <img className='wood' src='../styles/wood.svg' />
      <img className='torch' src='../styles/torch.svg' />
      </div>
  );
}

// RENDER - Navigation Bar
function NavBar(props){
  return (
  <nav className='navbar'>
  <img src='../styles/lighthouse.svg' />
  <a href='/' className='navbar-brand'>Beacon</a>
  <label>Number of Users: {props.numOfUsers}</label>
  </nav>
  );
}

// REACT.COMPONENT - responsible for the main application & WebSocket server communication
class App extends Component {
  constructor() {
    super();
    this.state = { 
      loading: true, 
      messages: [],
      currentUser: {name: 'Anonymous'},
      colour: '#010101',
      numOfUsers: 0
    }
    // websocket setup
    const socketServerURL = 'ws://localhost:3001'
    this.socket = new WebSocket(socketServerURL);

    // bind methods
    this.updateMessages = this.updateMessages.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
  }

  // REQUEST (new username): client ---> server
  updateUsername(newUsername){
    const usernameBody = {
      type: 'notifyMessage',
      content: `${this.state.currentUser.name} changed their name to ${newUsername}`,
      currentUser: {name: newUsername}
    }
    this.setState({currentUser: {name: newUsername}})
    this.socket.send(JSON.stringify(usernameBody))
  }

  // REQUEST (new message): client ---> server
  updateMessages(newMessage){
      const messageBody = {
        type: 'postMessage',
        content: newMessage,
        username: this.state.currentUser
      }
      this.socket.send(JSON.stringify(messageBody));
    }

  componentDidMount() {

    // simulated delay on initial render
    setTimeout(() => {
      this.setState({loading: false})
      }, 1300);

    // websocket connection to server
    this.socket.onopen = () => {
      console.log('Connected to Server');
    };

    // RESPONSE: client <--- server
    this.socket.onmessage = (event) => {
      const serverData = JSON.parse(event.data);

      switch(serverData.type) {

        case 'numOfUsers':
          this.setState({numOfUsers: serverData.totalNum});
        break;

        default:
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
          <MessageList messageList={this.state.messages}
                       colour={this.state.colour} />
          </div>
        }
      </div>
    );
  }
}

export default App