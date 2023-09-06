import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './NavigationService'; // Import the navigationRef


function AccountScreen() {

  const handleLogout = () => {
    // TODO: redirect to login...
    AsyncStorage.removeItem('user')
      .then(() => {
        navigationRef.current?.navigate('Home');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>
              Logout
          </Text>
        </TouchableOpacity>
    </View>
  );
}


const highlight_color = '#357A48';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: 300,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: highlight_color,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    toggleText: {
        marginTop: 10,
        color: highlight_color,
    },
});

export default AccountScreen;
