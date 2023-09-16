import React, { useState } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Platform,
	Modal,
	TouchableOpacity,
	Image,
  TextInput
} from 'react-native';
import Slider from "react-native-sliders";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserName, AddTrip, GetUserId, IsDriver} from './services/ApiHandler';


const GOOGLE_MAPS_APIKEY = 'AAIzaSyDrwiWWzU9dTML6CrMVHgEx8ZrcRFunoa8';

function SearchGoogleAutoComplete(props) {
  return (
    <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={true}
                returnKeyType={'search'} // Can be left out for default return key 
                listViewDisplayed={false}    // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    props.notifyChange(details.geometry.location);
                }}
                query={{
                    key: 'AIzaSyDrwiWWzU9dTML6CrMVHgEx8ZrcRFunoa8',
                    language: 'en'
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
                styles={{
                  container: { width: 300 }, // Check this line for width styles
                  textInputContainer: { width: '100%' }, // Check this line for width styles
                }}
            />
  );
}
// function MyMapComponent({ startLocation, endLocation }) {
// 	const { startLat, startLng } = startLocation;
// 	const { endLat, endLng } = endLocation;

// 		// Calculate the center point
// 		const centerLat = (startLat + endLat) / 2;
// 		const centerLng = (startLng + endLng) / 2;
	
// 		// Calculate the delta values for padding (adjust these values as needed)
// 		const latitudeDelta = Math.abs(startLat - endLat) * 2;
// 		const longitudeDelta = Math.abs(startLng - endLng) * 2;

// 	return (
// 		<MapView
// 			style={{ flex: 1, zIndex: -1, width: '100%', height: '100%'  }}
// 			initialRegion={{
// 				latitude: centerLat,
// 				longitude: centerLng,
// 				latitudeDelta,
// 				longitudeDelta,
// 			}}
// 			zoomEnabled={false} // Disable zooming
// 			scrollEnabled={false} // Disable panning
// 			mapType="standard" // standard, satellite, hybrid, terrain
// 			// TODO: in settings we can store a user cookie for settings,
// 			//. we could change this value easily depending on the cookie
// 		>
// 			<Marker
// 				coordinate={{ latitude: startLat, longitude: startLng }}
// 				title="Start Location"
// 			/>
// 			<Marker
// 				coordinate={{ latitude: endLat, longitude: endLng }}
// 				title="End Location"
// 			/>
//       <MapViewDirections
//         origin={startLocation}
//         destination={endLocation}
//         apikey={GOOGLE_MAPS_APIKEY}
//         lineDashPattern={[0]}
//         strokeWidth={3}
//         strokeColor="#357A48"
//       />
//     </MapView>
// 	);
// }



function AddTripScreen() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [price, setPrice] = useState("");
  const [detourRange, setDetourRange] = useState("")

  const handleStartLocationChange = (location) => {
    setStartLocation(location);
  };

  const handleEndLocationChange = (location) => {
    setEndLocation(location);
  };
  const handleSubmit = async () => {
    console.log(startLocation, endLocation)
    const startLat = startLocation.lat;
    const startLng = startLocation.lng;
    const endLat = endLocation.lat;
    const endLng = endLocation.lng; 
    AsyncStorage.setItem('user', 'p1');
    const user = await AsyncStorage.getItem('user');
    console.log(user+' hehehehe')
    var userId = await getUserName(user).userId;
    const newTrip = {
      DriverId : userId,
      DateTime : new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),
      Price : price,
      StartLatitude : startLat,
      StartLongitude : startLng,
      EndLatitude : endLat,
      EndLongitude : endLng,
      Detour : detourRange,
    };
    console.log(newTrip)
    console.log('Start Location:', startLocation);
    console.log('End Location:', endLocation);
    console.log('Price:', price);
    console.log('DetourRange:', detourRange);
    // await AddTrip(newTrip);
  }; 
  return (
    <View style={styles.container}>
      {/* Start Location */}
      <Text>Start Location:</Text>
      <SearchGoogleAutoComplete notifyChange={handleStartLocationChange} />
      {console.log("Start location complete")}

      {/* End Location */}
      <Text>End Location:</Text>
      <SearchGoogleAutoComplete notifyChange={handleEndLocationChange} />
      {console.log("End location complete")}
      {/* {startLocation && endLocation && (
      <MyMapComponent
        startLocation={{ startLat: startLocation.lat, startLng: startLocation.lng }}
        endLocation={{ endLat: endLocation.lat, endLng: endLocation.lng }}
      />
      )} */}
      {/* Other Information */}
      <Text>Price:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(double) => {
          const parsedPrice = parseFloat(double);
          if (!isNaN(parsedPrice) || double === ""){
            setPrice(double.toString())
            {console.log("Price set")}
          }
        }}
        
          value={price.toString()}
      />
      {/* <View style={styles.slider}>
        <Slider
          value={this.state.value}
          onValueChange={value => setPrice({ value })}
        />
        <Text>
          Value: {this.state.value}
        </Text>
      </View> */}
      <Text>Detour Range:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => {
          const parsedRange = parseFloat(text);
          if (!isNaN(parsedRange) || text === ""){
            setDetourRange(text.toString())
          }
        }}
        
          value={detourRange.toString()}
      />

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );  };



const highlight_color = '#357A48';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100%',
  },
  header: {
      fontSize: 24,
      marginBottom: 20,
  },
  input: {
      width: 300,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 10,
      borderRadius: 5,
  },
  button: {
      backgroundColor: highlight_color,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
  },
  buttonText: {
      color: 'white',
      fontSize: 16,
  },
  toggleText: {
      marginTop: 10,
      color: highlight_color,
  }
});


export default AddTripScreen;
