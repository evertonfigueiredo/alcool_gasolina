import { useState } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text'
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomAlert from '../../components/CustomAlert';
import { Image } from 'react-native';

export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);


  const [gasolina, setGasolina] = useState('')
  const [alcool, setAlcool] = useState('')
  const [msg, setMsg] = useState("Erro ao realizar calculo.")

  const handleShowAlert = () => {
    setIsAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  function showCalc() {

    // Define isLoading como true para mostrar o ActivityIndicator
    setIsLoading(true);

    // Simula uma operação assíncrona, como uma chamada de API
    setTimeout(() => {
      // Após a operação assíncrona, define isLoading como false para esconder o ActivityIndicator
      let calcGasolina = gasolina.substring(3)
      calcGasolina = parseFloat(calcGasolina.replace(",", "."));


      let calcAlcool = alcool.substring(3)
      calcAlcool = parseFloat(calcAlcool.replace(",", "."));


      if (calcGasolina === 0 || isNaN(calcGasolina)) {
        setIsLoading(false);
        setMsg("Por favor preencha o valor da gasolina.")
        handleShowAlert()
        return
      }

      if (calcAlcool === 0 || isNaN(calcAlcool)) {
        setIsLoading(false);
        setMsg("Por favor preencha o valor da álcool.")
        handleShowAlert()
        return
      }

      

      let precoRelativo = calcAlcool / calcGasolina;

      // Verifica se o álcool é mais recomendado do que a gasolina
      if (precoRelativo <= 0.7) {
        setMsg("É mais vantajoso usar álcool.")
      } else {
        setMsg("É mais vantajoso usar gasolina.")
      }
      setIsLoading(false);
      handleShowAlert()
      // Execute sua lógica aqui
    }, 1000);

  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.inputContainer}>
          <Image source={require('../../../assets/posto.png')} style={styles.image}/>
          <CustomText>Valor da Gasolina</CustomText>
          <TextInputMask
            type='custom'
            options={{
              precision: 2,
              separator: ',',
              delimiter: '.',
              unit: 'R$',
              suffixUnit: '',
              mask: 'R$ 9,99'
            }}
            value={gasolina}
            onChangeText={text => setGasolina(text)}
            placeholder='R$ 0,00'
            style={styles.input}
            keyboardType='numeric'
          />
          <CustomText>Valor do Álcool</CustomText>
          <TextInputMask
            type='custom'
            options={{
              precision: 2,
              separator: ',',
              delimiter: '.',
              unit: 'R$',
              suffixUnit: '',
              mask: 'R$ 9,99'
            }}
            value={alcool}
            onChangeText={text => setAlcool(text)}
            placeholder='R$ 0,00'
            style={styles.input}
            keyboardType='numeric'
          />
          <CustomButton title='Calcular' onPress={showCalc} />
          <CustomAlert
            visible={isAlertVisible}
            message={msg}
            onClose={handleCloseAlert}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Garante que a View ocupe 100% da largura da tela
  },
  inputContainer: {
    width: '80%', // Garante que a View envolvente ocupe 80% da largura da tela
  },
  input: {
    width: '100%',
    height: 70,
    textAlign: "center",
    backgroundColor: '#ddd',
    borderRadius: 5,
    fontSize: 50,
    padding: 5
  },
  image: {
    width: 100, // Largura da imagem em pixels
    height: 100, // Altura da imagem em pixels
    alignSelf: 'center'
  },
});

