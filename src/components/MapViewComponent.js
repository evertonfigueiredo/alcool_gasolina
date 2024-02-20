import React, { useState, useEffect } from 'react';
import { View, Platform, PermissionsAndroid, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapViewComponent = ({ gasStations, handleMarkerPress, handleMapPress }) => {
  const [location, setLocation] = useState({
    coords: {
      longitude: -111,
      latitude: -2,
      latitudeDelta: 0.9,
      longitudeDelta: 0.4
    }
  });

  useEffect(() => {
    getLocationAndFetchGasStations();
  }, []);

  async function getLocationAndFetchGasStations() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      let userLocation = await Location.getCurrentPositionAsync({ accuracy: 6 });
      setLocation(userLocation);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  return (
    <MapView
      onMapReady={() => {
        Platform.OS === 'android' ?
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )
            .then(() => {
            })
          : ""
      }}
      style={styles.map}
      region={{
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      zoomEnabled={true}
      minZoomLevel={10}
      showsUserLocation={true}
      loadingEnabled={true}
      onPress={handleMapPress}
    >
      {gasStations.map((station, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: station.geometry.location.lat,
            longitude: station.geometry.location.lng,
          }}
          title={station.name}
          onPress={() => handleMarkerPress(station)}
        >
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapViewComponent;
