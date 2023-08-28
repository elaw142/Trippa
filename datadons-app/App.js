import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import HomeScreen from "./HomeScreen";
import AccountScreen from "./AccountScreen";
import AddTripScreen from "./AddTripScreen";

import { StyleSheet, Text, View, MaskedViewIOS, Animated } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

const Tab = createBottomTabNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const splashVideo = React.useRef(null);
  const [shouldShowSplash, setShouldShowSplash] = useState(true);
  const fadeInWhite = new Animated.Value(0); // this will control the white overlay fade in

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
    <View style={styles.container} onLayout={onLayoutRootView}>
      {shouldShowSplash ? (
        <>
          <View style={styles.videoContainer}>
            <Video
              ref={splashVideo}
              source={require("./assets/splashvideo.mp4")}
              rate={1.0}
              isMuted={true}
              resizeMode={"cover"}
              shouldPlay
              style={styles.videoStyle}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  Animated.timing(fadeInWhite, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                  }).start(() => {
                    setShouldShowSplash(false);
                  });
                }
              }}
            />
          </View>

          <Animated.View
            style={{
              ...styles.videoContainer,
              backgroundColor: "white",
              opacity: fadeInWhite,
              position: "absolute", // to overlay on top of the video
              top: 0,
              left: 0,
            }}
          />
        </>
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                  iconName = focused ? "home" : "home-outline";
                } else if (route.name === "Account") {
                  iconName = focused ? "person" : "person-outline";
                } else if (route.name === "AddTrip") {
                  iconName = focused ? "add-circle" : "add-circle-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#357A48", // Set the active tab color
              tabBarInactiveTintColor: "black", // Set the inactive tab color
              tabBarStyle: {
                display: "flex", // Add any additional tabBar styles here
              },
            })}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name="AddTrip"
              component={AddTripScreen}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name="Account"
              component={AccountScreen}
              options={{ headerShown: false }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  videoContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoStyle: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    zIndex: -1, // This ensures the content is rendered below the video
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
