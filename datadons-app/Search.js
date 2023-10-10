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
import { getAllTrips } from "./services/ApiHandler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";


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

function getTrips(){
    const allTrips = getAllTrips();
    return allTrips;
}

function Search(){
    const [date, setDate] = useState('');
    const [numPeople, setNumPeople] = useState('');
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [startAddress, setStartAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const [isDateModalVisible, setDateModalVisible] = useState(false);
    const [isNumPeopleModalVisible, setNumPeopleModalVisible] = useState(false);

    
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

    const handleSearch = () => {
        // Handle the search logic here (e.g., call an API or perform a search action)
        console.log('Searching with the following data:', {
          from,
          destination,
          date,
          numPeople,
        });
        const allTrips = getTrips();
        console.log(allTrips)
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
          <TextInput
            placeholder="Date"
            style={styles.input}
            value={date}
            onChangeText={text => setDate(text)}
            />
        <TextInput
            style={styles.input}
            value={numPeople}
            placeholder="Number of riders"
            onChangeText={text => setNumPeople(text)}
            keyboardType="numeric"
        />
          </View>
        <Button title="Search" onPress={handleSearch} />

      {/* Date Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDateModalVisible}
        onRequestClose={toggleDateModal}>
        {/* Add your date selection UI and close button here */}
        <View style={styles.modalContainer}>
          {/* Your date selection UI */}
          <Button title="Close" onPress={toggleDateModal} />
        </View>
      </Modal>

      {/* Number of People Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNumPeopleModalVisible}
        onRequestClose={toggleNumPeopleModal}>
        {/* Add your number of people selection UI and close button here */}
        <View style={styles.modalContainer}>
          {/* Your number of people selection UI */}
          <Button title="Close" onPress={toggleNumPeopleModal} />
        </View>
      </Modal>
      </View>
    )
};
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
        
    }
  });
export default Search;