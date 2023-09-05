import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './NavigationService';
import { getUserName, AddUser } from './services/ApiHandler';


function LoginRegister({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerification, setPasswordVerification] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);


    const handleLogin = async () => {
        try {
          const result = await getUserName(username);
      
          if (result && result.username === username && password === result.password) {
            // AsyncStorage.setItem('user', username);
            console.log('Login successful');
            onLoginSuccess();
            // navigateToHome();
          } else {
            // TODO: better error handling
            alert('Username or password is incorrect');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };
      

      const handleRegister = async () => {
        const newUser = {
            username: username,
            password: password,
            phone: phoneNumber
        };
      
        try {
          const result = await getUserName(username);
            
        if (result.username === username) {
            alert('Username already exists');
        } else {
            await AddUser(newUser); // Assuming AddUser returns a promise
            console.log('User created');
            setIsRegistering(!isRegistering);
            setUsername('');
            setPassword('');
            setPhoneNumber('');
        }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      

    return (
        // TODO: add login embellishments (logo, when passwords dont match, taken user name exc...)
        <View style={styles.container}>
            {isRegistering ? (

                // REGISTER
                <View style={styles.container}>
                    <Text style={styles.header}>Register</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        autoCapitalize="none"
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        keyboardType="numeric" 
                        onChangeText={(text) => setPhoneNumber(text)}
                        value={phoneNumber}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onChangeText={(text) => setPasswordVerification(text)}
                        value={passwordVerification}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={isRegistering ? handleRegister : handleLogin}
                    >
                        <Text style={styles.buttonText}>
                            Register
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsRegistering(!isRegistering)}
                    >
                        <Text style={styles.toggleText}>
                            Already have an account? Login
                        </Text>
                    </TouchableOpacity>
                </View>


            ) : (


                // LOGIN
                <View style={styles.container}>
                    <Text style={styles.header}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        autoCapitalize="none"
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsRegistering(!isRegistering)}
                    >
                        <Text style={styles.toggleText}>
                            Don't have an account? Register
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
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

export default LoginRegister;
