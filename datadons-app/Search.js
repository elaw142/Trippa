import React, { useState, useRef } from "react";
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
  Button
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import { getAllTrips } from "./services/ApiHandler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// * MAP FUNCTIONALITY * //
function MyMapComponent({ startLocation, endLocation }) {
  const { startLat, startLng } = startLocation;
  const { endLat, endLng } = endLocation;

  // Calculate the center point
  const centerLat = (startLat + endLat) / 2;
  const centerLng = (startLng + endLng) / 2;

  // Calculate the delta values for padding (adjust these values as needed)
  var latitudeDelta = Math.abs(startLat - endLat) * 2;
  var longitudeDelta = Math.abs(startLng - endLng) * 2;
  if (latitudeDelta == 0) {
    latitudeDelta += 0.00001;
  }
  if (startLng == endLat) {
    longitudeDelta += 0.00001;
  }

  // determine platform for custom pin
  const pinImage =
    Platform.OS === "ios"
      ? require("./assets/pin-ios.png")
      : require("./assets/pin-android.png");

  return (
    <MapView
      style={{ flex: 1, zIndex: -1, width: "100%", height: "100%" }}
      initialRegion={{
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta,
        longitudeDelta,
      }}
      zoomEnabled={false}
      scrollEnabled={false}
      mapType="standard" // standard, satellite, hybrid, terrain
      // TODO: in settings we can store a user cookie for settings,
      //. we could change this value easily depending on the cookie
    >
      {/* <Marker
        coordinate={{ latitude: startLat, longitude: startLng }}
        title="Start Location"
      />
      <Marker
        coordinate={{ latitude: endLat, longitude: endLng }}
        title="End Location"

      /> */}
      <Marker
        coordinate={{ latitude: startLat, longitude: startLng }}
        title="Start Location"
        centerOffset={{ x: 1, y: -8 }}
      >
        <Image source={pinImage} resizeMode="contain" style={styles.pinImage} />
      </Marker>
      <Marker
        coordinate={{ latitude: endLat, longitude: endLng }}
        title="Start Location"
        centerOffset={{ x: 1, y: -8 }}
      >
        <Image source={pinImage} resizeMode="contain" style={styles.pinImage} />
      </Marker>
    </MapView>
  );
}

// * DATE TIME FUNCTIONALITY * //
function formatDateTime(dateTimeString) {
  if (dateTimeString === undefined) {
    return null;
  }
  const date = new Date(dateTimeString);
  const formattedTime = format12HourTime(date);
  const formattedDate = `${date.getDate()}${getDaySuffix(date.getDate())}`;
  return `${formattedTime} on ${formattedDate}`;
}

function format12HourTime(date) {
  if (date === undefined) {
    return null;
  }
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute}${ampm}`;
}


// Helper function to get the day suffix (e.g., "st", "nd", "rd", "th")
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

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

// function getTrips(){
//     const allTrips = getAllTrips();
//     return allTrips;
// }

function Search(){
    const [date, setDate] = useState('');
    const [numPeople, setNumPeople] = useState('');
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [startAddress, setStartAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const [isDateModalVisible, setDateModalVisible] = useState(false);
    const [isNumPeopleModalVisible, setNumPeopleModalVisible] = useState(false);
    const [dateTime, setDateTime] = useState(new Date()); // this will preset it to "today's" date
    const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);


    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const handleStartLocationChange = (location, address) => {
        setStartLocation(location);
        setStartAddress(address);
      };
    
      const handleEndLocationChange = (location, address) => {
        setEndLocation(location);
        setEndAddress(address);
      };

    const toggleDateModal = () => {
        setDateModalVisible(!isDateModalVisible);
      };
    
    const toggleNumPeopleModal = () => {
        setNumPeopleModalVisible(!isNumPeopleModalVisible);
      };

    const [tripsData, setTripsData] = useState([]);
    function getTrips(){

      getAllTrips().then((trips) => {
        // if(tripsData.length != trips.length){
        // }
        console.log(trips.length + " Trip(s) fetched");
        setTripsData(trips);
        toggleModal();
      });
    }

    const handleSearch = () => {
        // Handle the search logic here (e.g., call an API or perform a search action)
        console.log('Searching with the following data:', {
          date,
          numPeople,
        });
        getTrips();
        // console.log(allTrips)
      };
    return (
        <View style={styles.container}>
          <SearchGoogleAutoComplete
            styles={{
              container: { width: 300, zIndex: 9999 },
              textInputContainer: { width: "100%" },
              listView: { backgroundColor: "white" },
            }}
            notifyChange={handleStartLocationChange}
          />
          <SearchGoogleAutoComplete
            styles={{
              container: { width: 300, zIndex: 9999 },
              textInputContainer: { width: "100%" },
              listView: { backgroundColor: "white" },
            }}
            notifyChange={handleEndLocationChange}
          />
          <View style={styles.buttonContainer}>
        {/* Date time picker */}
        <View style={styles.dateTimeContainer}>
            <Text>Select DateTime:</Text>
            <TouchableOpacity onPress={() => setDateTimePickerVisible(true)}>
                <Text>{formatDateTime(dateTime)}</Text>
            </TouchableOpacity>
            {isDateTimePickerVisible && (
                <DateTimePicker
                value={dateTime}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                    setDateTimePickerVisible(false); // Hide the picker after selecting a date
                    const currentDate = selectedDate || dateTime;
                    setDateTime(currentDate);
                }}
                />
            )}
        </View>
        <TextInput
            style={styles.input}
            value={numPeople}
            placeholder="Number of riders"
            onChangeText={text => setNumPeople(text)}
            keyboardType="numeric"
        />
          </View>
        <Button title="Search" onPress={handleSearch} />
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          {/* FlatList inside the modal */}
          {tripsData.length > 0 ? (
                      <FlatList
                      data={tripsData}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          key={item.tripID}
                          onPress={() => handleItemPress(item)}
                        >
                          <View style={styles.tripCard}>
                            <MyMapComponent
                              startLocation={{
                                startLat: item.startLatitude,
                                startLng: item.startLongitude,
                              }}
                              endLocation={{
                                endLat: item.endLatitude,
                                endLng: item.endLongitude,
                              }}
                            />
                            <Text style={styles.dateTime}>
                              {formatDateTime(item.dateTime)}
                            </Text>
                            <Text style={styles.riderInfo}>
                              <FontAwesome5
                                name="car-side"
                                size={14}
                                color={highlight_color}
                              />
                              {item.currentRiders}/{item.maxRiders}
                            </Text>
          
                            <View style={styles.cardLocation}>
                              <Text style={styles.price}>${item.price}</Text>
                              <Text style={styles.location}>
                                {/* {convertAddressApiJson(item.startLocation, item.endLocation)[0]} */}
                                {item.startLocation}
                                <AntDesign
                                  name="arrowright"
                                  size={13}
                                  color={highlight_color}
                                />
                                {/* {convertAddressApiJson(item.startLocation, item.endLocation)[1]} */}
                                {item.endLocation}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.tripID}
                      vertical
                      showsVerticalScrollIndicator={false}
                    />
          ) : (
            <Text>No trips found</Text>
          )}

          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>

      </View>
    )
};
const paddingValue = 3;
const highlight_color = "#007c3e";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom: 10,
      padding: 10,
    },
    buttonContainer:{
        flexDirection: "row",
        alignItems: "center"
        
    },
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      width: "100%",
      borderWidth: 1,
      borderColor: "#ccc",
      paddingTop: 50,
    },
    tripCard: {
      backgroundColor: "white",
      borderWidth: 0.6,
      borderColor: "#ccc",
      borderRadius: 8,
      overflow: "hidden",
      marginVertical: 8,
      height: 200,
      minWidth: "95%",
    },
    pinImage: {
      ...Platform.select({
        ios: {
          width: 50,
          height: 50,
        },
        android: {
          width: 30,
          height: 30,
        },
      }),
    },
    price: {
      position: "absolute",
      bottom: 25 + paddingValue,
      left: paddingValue,
      overflow: "hidden",
      backgroundColor: "green",
      color: "white",
      borderWidth: 0.6,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 4,
      fontSize: 12,
    },
    location: {
      position: "absolute",
      bottom: paddingValue,
      left: paddingValue,
      overflow: "hidden",
      backgroundColor: "white",
      borderWidth: 0.6,
      borderColor: "#ccc",
      borderRadius: 8,
      color: "black",
      padding: 4,
      fontSize: 12,
    },
    riderInfo: {
      position: "absolute",
      bottom: paddingValue,
      right: paddingValue,
      overflow: "hidden",
      backgroundColor: "white",
      borderWidth: 0.6,
      borderColor: "#ccc",
      borderRadius: 8,
      color: "black",
      padding: 4,
      fontSize: 12,
    },
    dateTime: {
      position: "absolute",
      top: paddingValue,
      left: paddingValue,
      overflow: "hidden",
      backgroundColor: "white",
      borderWidth: 0.6,
      borderColor: "#ccc",
      borderRadius: 8,
      color: "black",
      padding: 4,
      fontSize: 12,
    },
  });
export default Search;