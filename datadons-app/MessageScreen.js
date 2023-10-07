import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class RideChat extends React.Component {
  state = {
    messages: [
      {
        _id: 1,
        text: 'Hello there',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: require("./assets/testUser.png"),
        },
      },
      {
        _id: 2,
        text: 'Hi!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: require("./assets/danielboy.png"),
        },
      },
    ]
  };

  // Function to handle new messages
  onSend(messages = []) {
    // Create a custom message object
    messages[0].user.avatar = require("./assets/icon.png");
    // TODO: set
    messages[0].user.name = AsyncStorage.setItem('user', username);

    // Append the custom message to the messages state
    this.setState(previousState => ({
      messages: GiftedChat.append([...previousState.messages], messages),
    }));
  }

  render() {
    return (
      
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)} 
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
