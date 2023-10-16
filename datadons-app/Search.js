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
import { ScrollView } from "react-native-gesture-handler";
import { ForeignObject } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  function haversine_distance(passenger, lat, long) {
    var R = 6371.0710; // Radius of the Earth in kms
    var rlat1 = passenger.lat * (Math.PI/180); // Convert degrees to radians
    var rlat2 = lat * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflon = (long-passenger.lng) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
    console.log(d)
    return d;
  }


function algorithmToSortArray(arrayToBeSorted, referenceArray) {
  console.log(arrayToBeSorted)
  const changeHistory = []
  for(let i = 0; i < referenceArray.length; i++) {
      number = referenceArray[i]

      for(let j = 0; j < changeHistory.length; j++) {
          if(changeHistory[j][0] === number) {
              number = changeHistory[j][1]
          } else if (changeHistory[j][1] === number) {
              number = changeHistory[j][0]
          }
      }

      if (i !== number) {  // this avoid some unnecessary swaps
          swapItems(i, number, arrayToBeSorted)
      }
      changeHistory[i] = [i, number]
  }

  return arrayToBeSorted
}
function swapItems(a, b, arrayToBeSorted) {
  var temp = arrayToBeSorted[a];
  arrayToBeSorted[a] = arrayToBeSorted[b];
  arrayToBeSorted[b] = temp;
}

function Search(){
    const [tripsData, setTripsData] = useState([]);
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
    const [sortedTrips, setsortedTrips] = useState([]);

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const handleStartLocationChange = (location, address) => {
          StartLocation(location);
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
    const handleItemPress = (item) => {
        // setSelectedItem(item);
      };

    function getTrips(){

      getAllTrips().then((trips) => {
        // if(tripsData.length != trips.length){
        // }
        console.log(trips.length + " Trip(s) fetched");
        // setTripsData(trips);
        toggleModal();
      });
    }
    function sortTrips(trips){
      const distList = [];
      const tripList = [];
      console.log(startLocation)
      trips.forEach(trip => {
        // check date is correct, check driver has space for passengers.
        const dStart = haversine_distance(startLocation, trip.startLatitude, trip.startLongitude);
        const dEnd = haversine_distance(endLocation, trip.endLatitude, trip.endLongitude);

        if (trip.detourRange / 1000 > dStart && trip.detourRange /1000 > dEnd){
          tripList.push(trip)
          distList.push(d)
        }
        
      });
      // console.log(distList)
      // console.log(tripList)
      const sortedTrips = algorithmToSortArray(tripList, distList)
      // console.log(sortedTrips)
      return sortedTrips
    }
    const handleSearch = () => {
        // Handle the search logic here (e.g., call an API or perform a search action)
        AsyncStorage.clear();
        console.log('Searching with the following data:', {
          date,
          numPeople,
        });
        getTrips();
        // console.log(startLocation)
        setsortedTrips(sortTrips(tripsData))
        setTripsData(sortedTrips)
        console.log(tripsData)
        setModalVisible(!isModalVisible)
      };
    return (
        <View style={styles.container}>

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
          {/* <View style={styles.buttonContainer}> */}

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
        </View>
      </Modal>
          {/* Date time picker */}
          <View style={styles.dateTimeContainer}>
            <Text>Select Date</Text>
            <TouchableOpacity onPress={() => setDateTimePickerVisible(true)}>
              <Text style={styles.dateEmoji}>&#128198;</Text>
            </TouchableOpacity>
            {isDateTimePickerVisible && (
                <DateTimePicker
                value={dateTime}
                mode="datetime"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {
                    setDateTimePickerVisible(false); // Hide the picker after selecting a date
                    const currentDate = selectedDate || dateTime;
                    setDateTime(currentDate);
                }}
                />
            )}
        </View>
        {/* number of riders*/}
        <View style={styles.numRidersContainer}>
          <Text>Number of passengers</Text>
        <TextInput
            style={styles.inputRiders}
            value={numPeople}
            onChangeText={text => setNumPeople(text)}
            keyboardType="numeric"
        />
          </View>
          <TouchableOpacity onPress={handleSearch} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        </View>
    )
};
const paddingValue = 3;
const highlight_color = "#007c3e";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: 20,
      backgroundColor: "#f2f2f2",
    },
    dateEmoji:{
      fontSize: 50
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      textAlign: "center",
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
    inputRiders: {
      width: 40,
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: "white",
      fontSize: 30,
    },
    button:{
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
    dateTimeContainer: {
      width: "100%",
      alignItems: "center",
      marginTop: 300,
    },
    numRidersContainer: {
      width: "100%",
      alignItems: "center",
      marginTop: 30,
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
  });
export default Search;