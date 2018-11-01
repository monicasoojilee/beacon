import React, {Component} from 'react';

class ChatBar extends Component {
    constructor(){
        super();
        // bind for event handler methods
        this.onNameEnter = this.onNameEnter.bind(this);
        this.onMessageEnter = this.onMessageEnter.bind(this);
    }

    // Change to username input field (press 'ENTER' event handler)
    onNameEnter(event){
        if (event.keyCode === 13) {
            const newUsername = event.target.value;
            this.props.updateUsername(newUsername);
        }
    }

    // Change to message input field (press 'ENTER' event handler)
    onMessageEnter(event){
        if (event.keyCode === 13) {
            const newMessage = event.target.value;
            this.props.updateMessages(newMessage);
            event.target.value = "";
            }
    }

    render() {
        return (
            <footer className="chatbar">
                <input className="chatbar-username" placeholder={this.props.currentUser.name} onKeyUp={this.onNameEnter}/>
                <input className="chatbar-message" placeholder="Type a message and hit 'ENTER'" onKeyUp={this.onMessageEnter}/>
            </footer>
        );
    }
  }

export default ChatBar;