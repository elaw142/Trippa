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

function Search(){
    const [from, setFrom] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [numPeople, setNumPeople] = useState('');
    
    const handleSearch = () => {
        // Handle the search logic here (e.g., call an API or perform a search action)
        console.log('Searching with the following data:', {
          from,
          destination,
          date,
          numPeople,
        });
      };
    return (
        <View style={styles.container}>
        <Text>From</Text>
        <TextInput
          style={styles.input}
          value={from}
          onChangeText={text => setFrom(text)}
        />
        <Text>Destination</Text>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={text => setDestination(text)}
        />
        <Text>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={text => setDate(text)}
        />
        <Text>Number of People</Text>
        <TextInput
          style={styles.input}
          value={numPeople}
          onChangeText={text => setNumPeople(text)}
          keyboardType="numeric"
        />
        <Button title="Search" onPress={handleSearch} />
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
  });
export default Search;