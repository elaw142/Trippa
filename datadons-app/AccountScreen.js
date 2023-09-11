import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './NavigationService'; // Import the navigationRef
import { AddDriver, getUserId } from './services/ApiHandler'


function AccountScreen() {
  const [license, setLicense] = useState('');
  const [carModel, setModel] = useState('');
  const [carColor, setColor] = useState('');
  const [carMake, setMake] = useState('');
  const [carType, setType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const [isRegistering, setItRegistering] = useState(false);

  
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
  
  const registerDriver = async () => {
    // Create a driver (done by adding driver to user)
    const newDriver = {
      licenseNumber: license,
      carModel: carModel,
      carColor: carColor,
      carMake: carMake,
      carType: carType,
      plateNumber: plateNumber
    };
    
    try {
      const user = await AsyncStorage.getItem('user');
      const userid = await getUserId('jamie');
      // console.log(userid);
      const result = await AddDriver(userid, newDriver);

      if (result && result.license === license) {
        alert("License already in use");
      } else {
        await AddDriver(user, newDriver);
        console.log("Driver Created");
        setItRegistering(!isRegistering);
        setLicense("");
        setModel("");
        setColor("");
        setMake("");
        setType("");
        setPlateNumber("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>
            Logout
        </Text>
      </TouchableOpacity>

      <Text style={styles.header}>Register as a Driver</Text>
      <Text>Enter your details below</Text>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Car Model"
          autoCapitalize="characters"
          onChangeText={(text) => setModel(text)}
          value={carModel}
        />
        <TextInput
          style={styles.input}
          placeholder="Car Colour"
          autoCapitalize="characters"
          onChangeText={(text) => setColor(text)}
          value={carColor}
        />
        <TextInput
          style={styles.input}
          placeholder="Car Make"
          autoCapitalize="characters"
          onChangeText={(text) => setMake(text)}
          value={carMake}
        />
        <TextInput
          style={styles.input}
          placeholder="Car Type"
          autoCapitalize="characters"
          onChangeText={(text) => setType(text)}
          value={carType}
        />
        <TextInput
          style={styles.input}
          placeholder="Plate Number"
          autoCapitalize="characters"
          onChangeText={(text) => setPlateNumber(text)}
          value={plateNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Driver's Lincense"
          autoCapitalize="characters"
          onChangeText={(text) => setLicense(text)}
          value={license}
        />
      <TouchableOpacity
        style={styles.button}
        onPress={registerDriver}
      >
        <Text style={styles.buttonText}>
          Become a driver
        </Text>
      </TouchableOpacity>
      </View>
      
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
        marginBottom: 25
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

const menu = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flexDirection: "column",
  },

})

export default AccountScreen;
