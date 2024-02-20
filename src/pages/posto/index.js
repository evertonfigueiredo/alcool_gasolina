import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, PermissionsAndroid, Text, } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { Modal, TextInput, Button } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const API_KEY = 'AIzaSyDLQOGfwGVMPqUg7CcETvyR7RlTY20DUU4';

export default function Posto() {
  const [location, setLocation] = useState({
    coords: {
      longitude: -111,
      latitude: -2,
      latitudeDelta: 0.9,
      longitudeDelta: 0.4
    }
  });
  const [gasStations, setGasStations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [gasPriceInput, setGasPriceInput] = useState('');
  const [alcoholPriceInput, setAlcoholPriceInput] = useState('');
  const [dieselPriceInput, setDieselPriceInput] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [forceUpdateFlag, setForceUpdateFlag] = useState(false);

  const handleMapPress = () => {
    setSelectedMarker(null);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditMode(false);
  };

  const handleGasPriceInput = (text) => {
    setGasPriceInput(text);
  };

  const handleAlcoholPriceInput = (text) => {
    setAlcoholPriceInput(text);
  };

  const handleDieselPriceInput = (text) => {
    setDieselPriceInput(text);
  };

  const handleButtonClick = (station) => {
    setSelectedStation(station);
    openModal();
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleSaveGasPrice = async () => {
    if (!selectedStation) {
      console.error('Nenhum posto selecionado.');
      return;
    }

    let tempGas = gasPriceInput.substring(3)
    tempGas = parseFloat(tempGas.replace(",", "."));

    let tempAlcohol = alcoholPriceInput.substring(3)
    tempAlcohol = parseFloat(tempAlcohol.replace(",", "."));

    let tempDiesel = dieselPriceInput.substring(3)
    tempDiesel = parseFloat(tempDiesel.replace(",", "."));

    // Verifica se os valores não são zero ou NaN antes de atualizá-los
    if (tempGas !== '' && !isNaN(parseFloat(tempGas)) && parseFloat(tempGas) !== 0) {
      selectedStation.gasPrice = parseFloat(tempGas);
    }
    if (tempAlcohol !== '' && !isNaN(parseFloat(tempAlcohol)) && parseFloat(tempAlcohol) !== 0) {
      selectedStation.alcoholPrice = parseFloat(tempAlcohol);
    }
    if (tempDiesel !== '' && !isNaN(parseFloat(tempDiesel)) && parseFloat(tempDiesel) !== 0) {
      selectedStation.dieselPrice = parseFloat(tempDiesel);
    }

    const updatedStations = gasStations.map(station => {
      if (station.place_id === selectedStation.place_id) {
        return selectedStation;
      }
      return station;
    });

    setGasStations(updatedStations);
    closeModal();
    setGasPriceInput('');
    setAlcoholPriceInput('');
    setDieselPriceInput('');
    setEditMode(false);
    setForceUpdateFlag(prevFlag => !prevFlag);
    alert("Valores atualizados com sucesso!")
    setSelectedMarker(null)
  };

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
      fetchGasStations(userLocation.coords.latitude, userLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  async function fetchGasStations(latitude, longitude) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=gas_station&key=${API_KEY}`
      );
      const data = await response.json();

      const stationsWithAdditionalInfo = data.results.map(station => ({
        ...station,
        gasPrice: 0.00,
        alcoholPrice: 0.00,
        dieselPrice: 0.00
      }));

      setGasStations(stationsWithAdditionalInfo);
    } catch (error) {
      console.error('Error fetching gas stations:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        key={forceUpdateFlag ? 'mapKey1' : 'mapKey2'}
        onMapReady={
          () => {
            Platform.OS === 'android' ?
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              )
                .then(() => {
                })
              : ""
          }
        }
        style={styles.map}
        region={{
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        zoomEnabled={true}
        minZoomLevel={15}
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
      {selectedMarker && (
        <View style={styles.buttonContainer}>
          <Button title={`Informações de Valores \n ${selectedMarker.name}`} onPress={() => handleButtonClick(selectedMarker)} />
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedStation && !editMode && (
              <View>
                <Text style={styles.stationName}>{selectedStation.name}</Text>
                <Text style={styles.stationName}>Gasolina: R$ {selectedStation.gasPrice.toFixed(2)}</Text>
                <Text style={styles.stationName}>Álcool: R$ {selectedStation.alcoholPrice.toFixed(2)}</Text>
                <Text style={styles.stationName}>Diesel: R$ {selectedStation.dieselPrice.toFixed(2)}</Text>
                <Button title="Editar" onPress={() => setEditMode(true)} />
                <Button title="Fechar" onPress={closeModal} />
              </View>
            )}
            {(selectedStation && editMode) && (
              <View>
                <Text>Digite os preços:</Text>
                <TextInputMask
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$ ',
                  }}
                  style={styles.input}
                  onChangeText={handleGasPriceInput}
                  value={gasPriceInput}
                  placeholder="Preço da gasolina"
                  keyboardType="numeric"
                />
                <TextInputMask
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$ ',
                  }}
                  style={styles.input}
                  onChangeText={handleAlcoholPriceInput}
                  value={alcoholPriceInput}
                  placeholder="Preço do álcool"
                  keyboardType="numeric"
                />
                <TextInputMask
                  type={'money'}
                  options={{
                    precision: 2,
                    separator: ',',
                    delimiter: '.',
                    unit: 'R$ ',
                  }}
                  style={styles.input}
                  onChangeText={handleDieselPriceInput}
                  value={dieselPriceInput}
                  placeholder="Preço do diesel"
                  keyboardType="numeric"
                />
                <Button title="Salvar" onPress={handleSaveGasPrice} />
                <Button title="Cancelar" onPress={closeModal} />
              </View>
            )}
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    width: '100%',
    height: 'auto'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  stationName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: "80%",
    zIndex: 1,
  },
});
