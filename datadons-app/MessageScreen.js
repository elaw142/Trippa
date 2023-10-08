import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RideChat extends React.Component {
  state = {
    messages: [],
    isChatModalVisible: false,
    selectedChat: null,
    chats: [
      {
        id: 1,
        title: 'Auckland Airport to Auckland CBD',
        messages: [
          {
            _id: 4,
            text: 'sweet see you soon (:',
            createdAt: Date.parse("2023-10-08T22:11:22.677Z"),
            user: {
              _id: 3,
              name: 'React Native',
              avatar: require("./assets/danielboy.png"),
            },
          },
          {
            _id: 3,
            text: 'Im on my way now',
            createdAt: Date.parse("2023-10-08T21:20:22.677Z"),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: require("./assets/testUser.png"),
            },
          },
          {
            _id: 2,
            text: 'That sounds great! ',
            createdAt: Date.parse("2023-10-07T21:20:22.677Z"),
            user: {
              _id: 1,
              name: 'React Native',
              avatar: require("./assets/testUser.png"),
            },
          },
          {
            _id: 1,
            text: 'Hi, i have created a spotify playlist for the trip!',
            createdAt: Date.parse("2023-10-06T21:14:14.677Z"),
            user: {
              _id: 3,
              name: 'Steve',
              avatar: require("./assets/testUser.png"),
            },
          },
          // Add more messages for Chat 1 as needed
        ],
      },
      {
        id: 2,
        title: 'Whangarei to Kerikeri',
        messages: [
          {
            _id: 1,
            text: 'yes that works for me!',
            createdAt: Date.parse("2023-10-07T22:20:22.677Z"),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: require("./assets/danielboy.png"),
            },
          },
          {
            _id: 2,
            text: 'Hi, i was wondering if we could leave at 5:30 instead of 5:00?',
            createdAt: new Date(),
            user: {
              _id: 3,
              name: 'React Native',
              avatar: require("./assets/testUser.png"),
            },
          },
          // Add more messages for Chat 2 as needed
        ],
      },
      // Add more chat entries as needed
    ],
  };

  // Function to handle new messages
  onSend(messages = []) {
    const chatIndex = this.state.chats.findIndex(chat => chat.id === this.state.selectedChat);
    if (chatIndex !== -1) {
      // Append the sent message to the selected chat's messages
      this.setState(previousState => {
        const newChats = [...previousState.chats];
        newChats[chatIndex].messages = GiftedChat.append(
          newChats[chatIndex].messages,
          messages
        );
        return { chats: newChats };
      });
    }
  }

  // Function to open the chat modal for a specific chat
  openChatModal(chatId) {
    this.setState({ isChatModalVisible: true, selectedChat: chatId });
  }

  // Function to close the chat modal
  closeChatModal() {
    this.setState({ isChatModalVisible: false, selectedChat: null });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Chats:</Text>
        <FlatList
          data={this.state.chats}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={() => this.openChatModal(item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal
          visible={this.state.isChatModalVisible}
          animationType="slide"
          onRequestClose={() => this.closeChatModal()}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => this.closeChatModal()} style={messageStyle.closeButton}>
              <Text>BACK</Text>
            </TouchableOpacity>
            {this.state.selectedChat !== null && (
              <GiftedChat
                messages={this.state.chats.find(chat => chat.id === this.state.selectedChat).messages}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: 1, // Set ID when out of testing phase
                  name: 'User Name', // Set the user's name
                  avatar: require("./assets/icon.png"), // Set the user's avatar
                }}
              />
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 8,
    margin: 10,
    backgroundColor: "gray",
    borderRadius: 8,
    marginVertical: 8,
    height: 70,
    minWidth: "95%",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  modalContainer: {
    flex: 1,
    paddingBottom: 20,
  },
});

const messageStyle = StyleSheet.create({
  closeButton: {
    backgroundColor: "#2196F3",
    marginTop: 50,
    width: 100,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  }
})
