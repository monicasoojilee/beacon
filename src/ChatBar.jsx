import React, {Component} from 'react';

class ChatBar extends Component {
    constructor(){
        super();
        this.onEnter = this.onEnter.bind(this);
    }

    onEnter(event){
        if (event.keyCode === 13) {
            const newMessage = event.target.value;
            this.props.updateMessages(newMessage);
            event.target.value = "";
            };
    }

    render() {
        return (
            <footer className="chatbar">
                <input className="chatbar-username" placeholder={this.props.currentUser.name} />
                <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyUp={this.onEnter}/>
            </footer>
        );
    }
  }

export default ChatBar;