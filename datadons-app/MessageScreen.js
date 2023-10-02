import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: item.sender === 'user' ? 'blue' : 'green',
              borderRadius: 10,
              margin: 5,
              padding: 10,
              maxWidth: '70%',
            }}>
            <Text style={{ color: 'white' }}>{item.text}</Text>
          </View>
        )}
        inverted 
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          marginBottom: 10,
        }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 5,
            marginRight: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity
          style={{
            backgroundColor: 'green',
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
          onPress={handleSend}>
          <Text style={{ color: 'white' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
