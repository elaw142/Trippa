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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";

// * DATE TIME FUNCTIONALITY * //
function formatDateTime(dateTimeString) {
  const formattedTime = `${dateTimeString.slice(9, 11)}${dateTimeString.slice(
    11,
    13
  )}`;

  const day = dateTimeString.slice(6, 8);
  const formattedDate = `${day}${getDaySuffix(Number(day))}`;
  return `${format12HourTime(formattedTime)}`;
}

function format12HourTime(dateTimeString) {
  const hour = Number(dateTimeString.slice(0, 2));
  const minute = dateTimeString.slice(2, 5);
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
  const latitudeDelta = Math.abs(startLat - endLat) * 2;
  const longitudeDelta = Math.abs(startLng - endLng) * 2;

  return (
    <MapView
      style={{ flex: 1, zIndex: -1, width: "100%", height: "100%" }}
      initialRegion={{
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta,
        longitudeDelta,
      }}
      zoomEnabled={false} // Disable zooming
      scrollEnabled={false} // Disable panning
      mapType="standard" // standard, satellite, hybrid, terrain
      // TODO: in settings we can store a user cookie for settings,
      //. we could change this value easily depending on the cookie
    >
      <Marker
        coordinate={{ latitude: startLat, longitude: startLng }}
        title="Start Location"
      />
      <Marker
        coordinate={{ latitude: endLat, longitude: endLng }}
        title="End Location"
      />
    </MapView>
  );
}

function HomeScreen() {
  const tripsData = [
    {
      id: "1",
      driverName: "John Doe",
      startLocation: "Auckland Central",
      endLocation: "Auckland Airport",
      price: "5.00",
      time: "20230829T100000Z",
      maxRiders: 4,
      currentRiders: 2,
      startLat: -36.844667,
      startLng: 174.758863,
      endLat: -37.004167,
      endLng: 174.785556,
    },
    {
      id: "2",
      driverName: "Jane Smith",
      startLocation: "Queen St",
      endLocation: "Whangarei Heads",
      price: "2.23",
      time: "20230829T113000Z",
      maxRiders: 3,
      currentRiders: 0,
      startLat: -36.847222,
      startLng: 174.764167,
      endLat: -35.731111,
      endLng: 174.323333,
    },
    {
      id: "3",
      driverName: "David Johnson",
      startLocation: "Rotorua",
      endLocation: "Taupo",
      price: "10.53",
      time: "20230829T130000Z",
      maxRiders: 5,
      currentRiders: 1,
      startLat: -38.136667,
      startLng: 176.249167,
      endLat: -38.685833,
      endLng: 176.070833,
    },
    {
      id: "4",
      driverName: "Sarah Wilson",
      startLocation: "Wellington",
      endLocation: "Napier",
      price: "8.99",
      time: "20230829T144500Z",
      maxRiders: 2,
      currentRiders: 2,
      startLat: -41.286667,
      startLng: 174.776111,
      endLat: -39.491667,
      endLng: 176.915,
    },
    {
      id: "5",
      driverName: "Michael Brown",
      startLocation: "Christchurch",
      endLocation: "Dunedin",
      price: "15.00",
      time: "20230829T163000Z",
      maxRiders: 6,
      currentRiders: 4,
      startLat: -43.532222,
      startLng: 172.636111,
      endLat: -45.878889,
      endLng: 170.5025,
    },
    {
      id: "6",
      driverName: "Emily Davis",
      startLocation: "Nelson",
      endLocation: "Picton",
      price: "6.82",
      time: "20230829T181500Z",
      maxRiders: 3,
      currentRiders: 1,
      startLat: -41.298333,
      startLng: 173.244167,
      endLat: -41.298333,
      endLng: 174.244167,
    },
    {
      id: "7",
      driverName: "Daniel Lee",
      startLocation: "Hamilton",
      endLocation: "Tauranga",
      price: "7.13",
      time: "20230829T200000Z",
      maxRiders: 4,
      currentRiders: 3,
      startLat: -37.7875,
      startLng: 175.279444,
      endLat: -37.686111,
      endLng: 176.167222,
    },
  ];

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

  const closeModal = () => {
    setSelectedItem(null);
    setRiderCount(1);
  };

  const makeTrip = () => {
    alert("Trip has been made");
  };

  const addToTrip = () => {
    alert("Your trip has been added");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <FlatList
        data={tripsData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.tripCard}>
              <MyMapComponent
                startLocation={{
                  startLat: item.startLat,
                  startLng: item.startLng,
                }}
                endLocation={{ endLat: item.endLat, endLng: item.endLng }}
              />
              <Text style={styles.dateTime}>{formatDateTime(item.time)}</Text>
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
                  {item.startLocation}
                  <AntDesign
                    name="arrowright"
                    size={13}
                    color={highlight_color}
                  />
                  {item.endLocation}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
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
                  <Text>From: {selectedItem.startLocation}</Text>
                  <Text>To: {selectedItem.endLocation}</Text>
                  <Text>Price: ${selectedItem.price}</Text>
                  <Text>Duration: Approx. 2hrs</Text>
                  <Text>Distance: 150km</Text>
                  <Text>Amenities: WiFi, Charging</Text>
                </View>

                {/* Displaying Riders Info and buttons to increase or decrease riders */}
                <View style={ModelStyles.riderBooking}>
                  <Text style={ModelStyles.riderText}>Number of seats:</Text>
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
                  <Text style={ModelStyles.buttonText}>Proceed to Payment</Text>
                </TouchableOpacity>

                {/* </View>  */}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// * STYLE CONSTANTS * //
const paddingValue = 3;
const highlight_color = "#357A48";

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
    paddingTop: 150,
  },

  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
