import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import slides from './slides'
import OnboardingItem from './OnboardingItem';

export default Onboarding = () => {
    return(
        <View style = {styles.container}>
            <FlatList data = {slides} renderItem = {({item}) => <OnboardingItem item = {item} />} />
                <Text>Onboarding</Text>
                </View>

);

};

const styles = StyleSheet.create({
    container: {

        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});