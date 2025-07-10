import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location'; // pra pegar localização do celular
import * as ImagePicker from 'expo-image-picker'; // pra tirar foto usando a câmera
import { insertDenuncia } from '../database/db'; // função q insere denúncia no banco

// Essa tela é onde o usuário cria uma denúncia nova
export default function NovaDenunciaScreen({ navigation }) {
  // estado que guarda a denúncia que o usuário vai preencher
  // descrição, foto (uri) e a localização (latitude e longitude)
  const [denuncia, setDenuncia] = useState({
    descricao: '',
    imagemUri: null,
    location: null
  });

  // useEffect que roda só uma vez quando a tela abre
  // ele pede permissão pra usar câmera e localização, senão não funciona
  useEffect(() => {
    (async () => {
      // pedir permissão pra usar câmera
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      // pedir permissão pra pegar localização em primeiro plano
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('receba na caixa dos peito')

      // se liberou localização, pega a posição atual do celular
      if (locationStatus === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        // salva as coordenadas no estado denuncia, sem perder o resto dos dados
        setDenuncia(prev => ({ ...prev, location: location.coords }));
      }
    })();
  }, []); // o [] faz rodar só 1 vez, quando abre a tela

  // função que abre a câmera pra tirar foto
  const handleTakePhoto = async () => {
    // chama a câmera com umas configs (permitir cortar, qualidade da foto etc)
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // permite o usuário cortar a foto antes de usar
      aspect: [4, 3],      // formato da foto 4:3
      quality: 0.7,        // qualidade da foto, de 0 a 1
    });

    // se o usuário não cancelou e tem foto, salva o uri da foto no estado
    if (!result.canceled && result.assets) {
      setDenuncia(prev => ({ ...prev, imagemUri: result.assets[0].uri }));
    }
  };

  // função que salva a denúncia no banco de dados
  const handleSave = async () => {
    try {
      // chama a função q insere no banco passando todos os dados
      await insertDenuncia(
        denuncia.descricao,
        denuncia.imagemUri,
        denuncia.location?.latitude ?? null,  // latitude ou null se n tiver
        denuncia.location?.longitude ?? null, // longitude ou null se n tiver
        new Date().toISOString()               // data atual em formato ISO (string)
      );
      Alert.alert('Sucesso', 'Denúncia registrada!'); // aviso de sucesso
      navigation.goBack(); // volta pra tela anterior (lista de denúncias)
      console.log('receba na caixa dos peito')
    } catch (error) {
      // se der erro, mostra no console e alerta o usuário
      console.error('Erro ao salvar denúncia:', error);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  // UI da tela
  return (
    <View style={styles.container}>
      {/* Input pra descrição da denúncia */}
      <TextInput
        placeholder="Descrição" // texto q aparece quando tá vazio
        value={denuncia.descricao} // valor q tá no estado
        onChangeText={text => setDenuncia(prev => ({ ...prev, descricao: text }))}
        // toda vez q digita muda o estado, só muda a descricao, o resto mantém
        style={styles.input}
      />

      {/* Botão pra tirar foto, muda o texto se já tirou */}
      <Button
        title={denuncia.imagemUri ? "Foto Capturada" : "Tirar Foto"}
        onPress={handleTakePhoto}
      />

      {/* se já tirou foto, mostra ela aqui embaixo */}
      {denuncia.imagemUri && (
        <Image source={{ uri: denuncia.imagemUri }} style={styles.image} />
      )}

      {/* botão pra salvar denúncia */}
      <Button
        title="Salvar Denúncia"
        onPress={handleSave}
        // só habilita se descrição e foto estiverem preenchidos
        disabled={!denuncia.descricao || !denuncia.imagemUri}
      />
    </View>
  );
}

// estilo básico pra tela ficar ajeitada
const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa a tela toda
    padding: 20, // espaço interno
    backgroundColor: '#fff', // fundo branco
  },
  input: {
    borderWidth: 1, // borda fina
    borderColor: '#ccc', // cor da borda cinza clarinho
    borderRadius: 6, // cantinhos arredondados
    padding: 10, // espaço interno
    marginBottom: 15, // espaço embaixo do input
    fontSize: 16, // texto maiorzinho
  },
  image: {
    width: '100%', // imagem ocupa toda largura
    height: 250,   // altura fixa da imagem
    borderRadius: 8, // cantos arredondados
    marginTop: 15, // espaço em cima da imagem
    marginBottom: 15, // espaço embaixo da imagem
  },
});
