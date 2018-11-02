import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    const messages = this.props.messageList.map(message => {
      return <Message 
        type={message.type}
        key={message.id}
        colour={message.colour}
        username={message.username}
        content={message.content} />
    });

    return (
      <main className='messages' >
      {messages}
      </main>
    );
  }
}

export default MessageList