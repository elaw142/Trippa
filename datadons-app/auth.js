import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { navigate } from './NavigationService';


function LoginRegister({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);


    const navigateToHome = () => {
        navigate('Home');
      };
    const handleLogin = async () => {
        // Implement login logic here with api...
        if (username === 'Test' && password === 'Test') {
            AsyncStorage.setItem('user', username);

            onLoginSuccess(); 
            // navigateToHome();
        } else {
            alert('Username or password is incorrect');
        }
    };

    const handleRegister = () => {
        // Implement registration logic here
    };

    return (
        <View style={styles.container}>
            {isRegistering ? (


                // REGISTER
                <View style={styles.container}>
                    <Text style={styles.header}>Register</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
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
                        onChangeText={(text) => setPassword(text)}
                        value={password}
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
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
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
