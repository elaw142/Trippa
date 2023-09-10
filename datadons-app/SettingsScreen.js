import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-stroage';

function SettingsScreen() {
    const options= [
        {
            header: {
                name: "Account",
            },

            values: [
                {
                    name: "Password",
                    description: "Manage your password",
                },
                {
                    name: "Email",
                    description: "Manage your email",
                },
                {
                    name: "Phone number",
                    decription: "Change your phone number",
                }
            ],
        },

        {
            header: {
                name: "Payment",
            },

            values: [
                {
                    name: "Payment Information",
                    description: "Manage your payment info",
                    tags: [],
                }
            ],
        }
    ]


    return (
        <div className="Settings">
            <h1>Settings</h1>
            {/* <input type="text" className="form-control" placeholder="Search"/>  */}
        </div>

    //const highlight_color = "#357A48"
    );
}

export default SettingsScreen;