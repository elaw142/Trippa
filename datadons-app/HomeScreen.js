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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllTrips } from "./services/ApiHandler";

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


function getFormattedAddress(address) {
  if (address === undefined) {
    return null;
  }
  return JSON.parse(address).results[0].formatted_address;
}

function convertAddressApiJson(start, end) {
  // this was interesting to code...
  // FIXME: bit of a hacky way to do this, but it works
  // pass in start and end address json from google api
  // returns the highest address point, eg auckland to whangari would return auckland to whangari
  // however auckland to auckland would return address to address
  function findHighestMismatchElement(list1, list2) {
    let index = -1;
    for (let i = list1.length - 1; i >= 0; i--) {
      if (list1[i].long_name !== list2[i].long_name) {
        index = i;
        break;
      }
    }
    return index;
  }

  var startComp = JSON.parse(start).results[0].address_components;
  var endComp = JSON.parse(end).results[0].address_components;

  var index = findHighestMismatchElement(startComp, endComp);

  return [startComp[index].short_name, endComp[index].short_name];
}

function HomeScreen() {
  const [selectedItem, setSelectedItem] = useState(null);

  const [riderCount, setRiderCount] = useState(1);

  const handleItemPress = (item) => {
    setSelectedItem(item);
  };

  const handleIncreaseRiders = () => {
    if (
      selectedItem &&
      selectedItem.currentRiders + riderCount < selectedItem.maxRiders
    ) {
      setRiderCount(riderCount + 1);
    }
  };
  const handleDecreaseRiders = () => {
    if (riderCount > 1) {
      setRiderCount(riderCount - 1);
    }
  };

const modalContentRef = useRef();

  const closeModal = () => {
    setSelectedItem(null);
    setRiderCount(1);
  };

  const onModalContainerPress = (event) => {
    event.persist(); 

    modalContentRef.current.measureInWindow((contentX, contentY, contentWidth, contentHeight) => {
        const { locationX, locationY } = event.nativeEvent;

        if (
            locationX < contentX ||
            locationX > contentX + contentWidth ||
            locationY < contentY ||
            locationY > contentY + contentHeight
        ) {
            closeModal();
        }
    });
};




  const makeTrip = () => {
    alert("Trip has been made");
  };

  const addToTrip = () => {
    alert("Your trip has been added");
  };


  const [tripsData, setTripsData] = useState([]);

  setTimeout(() => {
    getAllTrips().then((trips) => {
      // if(tripsData.length != trips.length){
      // }
      console.log(trips.length + " Trip(s) fetched");
      setTripsData(trips);
    });
  }, "2000");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.headerKiwi}>Kiwi</Text>
        <Text style={styles.headerKom}>Kommute</Text> */}
        <Text style={styles.headerKiwi}>TRIPPR</Text>
      </View>

      {tripsData.length > 0 ? (
        <>
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

          <Modal
            animationType="fade" //fade...slide
            transparent={true}
            visible={selectedItem !== null}
            onRequestClose={() => setSelectedItem(null)}
          >
            <TouchableOpacity
              style={ModelStyles.modalContainer}
              onPress={closeModal}
            >
              <View style={ModelStyles.modalContent}>
                {/* popup Display */}
                {selectedItem && (
                  <View style={ModelStyles.viewBox}>
                    <TouchableOpacity
                      style={ModelStyles.closeButton}
                      onPress={() => setSelectedItem(null)}
                    >
                      <FontAwesome
                        style={ModelStyles.closeButtonIcon}
                        name="close"
                        size={27}
                      />
                    </TouchableOpacity>

                    {/* Displaying Driver Info */}

                    <Image
                      source={require("./assets/testUser.png")}
                      style={ModelStyles.profileImage}
                    />
                    <Text style={ModelStyles.driverName}>
                      {selectedItem.driverName}
                    </Text>

                    <Text>{selectedItem.startLocation}</Text>
                    <Text>{selectedItem.endLocation}</Text>

                    {/* Trip details */}
                    <View style={ModelStyles.tripDetails}>
                      {/* <Text>From: {getFormattedAddress(selectedItem.startLocation)}</Text>
                  <Text>To: {getFormattedAddress(selectedItem.endLocation)}</Text> */}
                      <Text>From: {selectedItem.startLocation}</Text>
                      <Text>To: {selectedItem.endLocation}</Text>
                      <Text>Time: {formatDateTime(selectedItem.dateTime)}</Text>
                      <Text>Price: ${selectedItem.price}</Text>
                      <Text>Duration: Approx. 2hrs</Text>
                      <Text>Distance: 150km</Text>
                      <Text>Amenities: WiFi, Charging</Text>
                    </View>

                    {/* Displaying Riders Info and buttons to increase or decrease riders */}
                    <View style={ModelStyles.riderBooking}>
                      <Text style={ModelStyles.riderText}>
                        Number of seats:
                      </Text>
                      <TouchableOpacity
                        onPress={handleDecreaseRiders}
                        style={ModelStyles.riderButton}
                      >
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text style={ModelStyles.riderCount}>{riderCount}</Text>
                      <TouchableOpacity
                        onPress={handleIncreaseRiders}
                        style={ModelStyles.riderButton}
                      >
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={ModelStyles.paymentButton}
                      onPress={addToTrip}
                    >
                      <Text style={ModelStyles.buttonText}>
                        Proceed to Payment
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      ) : (
        <Text>No trips available</Text>
      )}
    </View>
  );
}


// * STYLE CONSTANTS * //
const paddingValue = 3;
const highlight_color = "#007c3e";

const styles = StyleSheet.create({
  cardLocation: {
    marginTop: "auto",
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

  header: {
    flexDirection: "col",
    padding: 10,
    width: "100%",
  },
  headerKiwi: {
    fontSize: 60,
    fontWeight: "bold",
    color: highlight_color,
  },

  headerKom: {
    fontSize: 60,
    fontWeight: "bold",
    color: highlight_color,
  },

  tripCard: {
    backgroundColor: "white",
    borderWidth: 0.6,
    borderColor: "#ccc",
    borderRadius: 8,
    // padding: 16,
    overflow: "hidden",
    marginVertical: 8,
    height: 200,
    minWidth: "95%",
    // maxWidth: '99%',
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
        // marginTop: 20,
        // marginLeft: 10,
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

const ModelStyles = StyleSheet.create({
  // ...
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flexDirection: "column",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginTop: 500,
    height: "100%",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: -10,
    right: 0,
    zIndex: 1,
    width: 40,
    height: 40,
    alignSelf: "center",
    marginTop: 10,
    color: highlight_color,
    justifyContent: "center",

    // * to see size of button
    // borderWidth: 1,
    // borderColor: 'black',
  },
  closeButtonIcon: {
    alignSelf: "center",
    color: highlight_color,
  },

  driverName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,

    borderWidth: 0.6,
    borderColor: "#ccc",
  },
  viewBox: {
    alignItems: "center",
    justifyContent: "center",
  },

  riderBooking: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  riderText: {
    marginRight: 10,
  },
  riderButton: {
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: highlight_color,
    borderRadius: 5,
  },
  riderCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tripDetails: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingBottom: 20,
    width: "80%",
  },
  paymentButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
    paddingBottom: 30,
    marginTop: 50,
    position: "bottom",
  },
  paymentButton: {
    backgroundColor: highlight_color,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "80%",
    color: "black",
  },
  paymentButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: highlight_color,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default HomeScreen;
