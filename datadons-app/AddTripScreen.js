import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getUserName,
  AddTrip,
  IsDriver,
  getUserId,
  getDriverByUserId,
} from "./services/ApiHandler";
import DateTimePicker from "@react-native-community/datetimepicker";

const GOOGLE_MAPS_APIKEY = "AAIzaSyDrwiWWzU9dTML6CrMVHgEx8ZrcRFunoa8";

function SearchGoogleAutoComplete(props) {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2} // minimum length of text to search
      autoFocus={true}
      returnKeyType={"search"} // Can be left out for default return key
      listViewDisplayed={"auto"} // true/false/undefined
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        props.notifyChange(
          details.geometry.location,
          details.formatted_address
        );
      }}
      query={{
        key: "AIzaSyDrwiWWzU9dTML6CrMVHgEx8ZrcRFunoa8",
        language: "en",
        location: "-40.900557,174.885971",
        radius: "1500000",
        components: "country:NZ",
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={300}
      styles={{
        container: { width: 300 }, // Check this line for width styles
        textInputContainer: { width: "100%" }, // Check this line for width styles
      }}
    />
  );
}

function AddTripScreen() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [price, setPrice] = useState("");
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [detourRange, setDetourRange] = useState("");
  const [dateTime, setDateTime] = useState(new Date()); // this will preset it to "today's" date
  const [maxRiders, setMaxRiders] = useState("");

  const handleStartLocationChange = (location, address) => {
    setStartLocation(location);
    setStartAddress(address);
  };

  const handleEndLocationChange = (location, address) => {
    setEndLocation(location);
    setEndAddress(address);
  };

  const handleSubmit = async () => {
    console.log(startLocation, endLocation);
    const startLat = startLocation.lat;
    const startLng = startLocation.lng;
    const endLat = endLocation.lat;
    const endLng = endLocation.lng;
    // AsyncStorage.setItem("user", "p1");
    const user = await AsyncStorage.getItem("user");
    console.log(user + " hehehehe");
    var username = await getUserName(user);
    var userId = await getUserId(username);
    var driverId = await getDriverByUserId(userId);
    console.log("driverId:", driverId);
    const newTrip = {
      DriverId: Number(driverId),
      DateTime: dateTime.toISOString(),
      MaxRiders: parseInt(maxRiders, 10),
      Price: price,
      StartLatitude: startLat,
      StartLongitude: startLng,
      EndLatitude: endLat,
      EndLongitude: endLng,
      Detour: detourRange,
      StartLocation: startAddress,
      EndLocation: endAddress,
    };
    console.log(newTrip);
    console.log("Start Location:", startLocation);
    console.log("End Location:", endLocation);
    console.log("Price:", price);
    console.log("DetourRange:", detourRange);
    console.log("startAddress", startAddress);
    console.log("endAddress", endAddress);
    await AddTrip(newTrip);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        {/* Title */}
        <Text style={styles.header}>Add a Trip</Text>
        {/* Start and End Location */}
        <View style={styles.locationContainer}>
          <Text>Start Location:</Text>
          <SearchGoogleAutoComplete
            styles={{
              container: { width: 300, zIndex: 9999 },
              textInputContainer: { width: "100%" },
              listView: { backgroundColor: "white" },
            }}
            notifyChange={handleStartLocationChange}
          />
        </View>
        <View style={styles.locationContainer1}>
          <Text>End Location:</Text>
          <SearchGoogleAutoComplete
            styles={{
              container: { width: 300, zIndex: 9999 },
              textInputContainer: { width: "100%" },
              listView: { backgroundColor: "white" },
            }}
            notifyChange={handleEndLocationChange}
          />
        </View>
        {/* Date time picker */}
        <View style={styles.dateTimeContainer}>
          <Text>Select DateTime:</Text>
          <DateTimePicker
            value={dateTime}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || dateTime;
              setDateTime(currentDate);
            }}
          />
        </View>
        {/* Maximum Riders Information */}
        <View style={styles.maxRidersContainer}>
          <Text>Maximum Riders:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => {
              const parsedRiders = parseInt(text, 10);
              if (!isNaN(parsedRiders) || text === "") {
                setMaxRiders(text);
              }
            }}
            value={maxRiders.toString()}
          />
        </View>
        {/* Price Information */}
        <View style={styles.priceContainer}>
          <Text>Price($NZD):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(double) => {
              const parsedPrice = parseFloat(double);
              if (!isNaN(parsedPrice) || double === "") {
                setPrice(double.toString());
              }
            }}
            value={price.toString()}
          />
        </View>
        {/* Detour Range Information */}
        <View style={styles.detourContainer}>
          <Text>Detour Range(Meters):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              const parsedRange = parseFloat(text);
              if (!isNaN(parsedRange) || text === "") {
                setDetourRange(text.toString());
              }
            }}
            value={detourRange.toString()}
          />
        </View>
        {/* Submit Button */}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const highlight_color = "#357A48";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#f2f2f2",
  },
  locationContainer: {
    width: "100%",
    overflow: "visible",
    alignItems: "center",
    marginTop: 150,
    zIndex: 9999,
    position: "absolute",
  },

  locationContainer1: {
    width: "100%",
    overflow: "visible",
    alignItems: "center",
    marginTop: 250,

    zIndex: 9998,
    position: "absolute",
  },
  dateTimeContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 160,
  },

  maxRidersContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },

  priceContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  detourContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  header: {
    fontSize: 40,
    marginBottom: 40,
    color: "#333",
    fontWeight: "bold",
    marginTop: 80,
    textAlign: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: highlight_color,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: "50%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  toggleText: {
    marginTop: 10,
    color: highlight_color,
  },
});

export default AddTripScreen;
