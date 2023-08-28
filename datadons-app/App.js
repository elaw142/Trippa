  import React, { useCallback, useEffect, useState } from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import { Ionicons } from '@expo/vector-icons';
  import HomeScreen from './HomeScreen';
  import AccountScreen from './AccountScreen';
  import AddTripScreen from './AddTripScreen';
  import Onboarding from './components/Onboarding';

  import { Stylesheet, Text, View, MaskedViewIOS, Animated } from "react-native";
  import Entypo from "@expo/vector-icons/Entypo";
  import * as SplashScreen from "expo-splash-screen";
  import * as Font from "expo-font";

  const Tab = createBottomTabNavigator();


  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync();

  export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
      async function prepare() {
        try {
          // Pre-load fonts, make any API calls you need to do here
          await Font.loadAsync(Entypo.font);
          // Artificially delay for two seconds to simulate a slow loading
          // experience. Please remove this if you copy and paste the code!
          // await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the application to render
          setAppIsReady(true);
        }
      }

      prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
      if (appIsReady) {
        // This tells the splash screen to hide immediately! If we call this after
        // `setAppIsReady`, then we may see a blank screen while the app is
        // loading its initial state and rendering its first pixels. So instead,
        // we hide the splash screen once we know the root view has already
        // performed layout.
        await SplashScreen.hideAsync();
      }
    }, [appIsReady]);

    if (!appIsReady) {
      return null;
    }

    return (
        <View

        
        // This is how we render the loaded state...
        style={{ flex: 1}}
        onLayout={onLayoutRootView}
        >

        <Onboarding />


    
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
          <Tab.Screen name="Home" component={HomeScreen}options={{headerShown:false}} />
          <Tab.Screen name="AddTrip" component={AddTripScreen}options={{headerShown:false}} />
          <Tab.Screen name="Account" component={AccountScreen}options={{headerShown:false}} />
        </Tab.Navigator>
      </NavigationContainer>
      </View>
    );
  }
