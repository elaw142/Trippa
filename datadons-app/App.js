import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import AccountScreen from './AccountScreen';
import AddTripScreen from './AddTripScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'AddTrip') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#357A48', // Set the active tab color
          tabBarInactiveTintColor: 'black', // Set the inactive tab color
          tabBarStyle: {
            display: 'flex', // Add any additional tabBar styles here
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="AddTrip" component={AddTripScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
