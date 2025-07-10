import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet, Button } from 'react-native';
import { fetchDenuncias } from '../database/db'; // função q pega os dados do banco
import { useNavigation } from '@react-navigation/native'; // hook pra navegar entre telas
import MapView, { Marker } from 'react-native-maps'; // mapa e marcador

// Esse componente é a tela inicial, onde mostra todas as denúncias q tão no banco.

export default function HomeScreen() {

  // Aqui a gente cria um estado pra guardar as denúncias q vieram do banco
  const [denuncias, setDenuncias] = useState([]);
  // Esse hook aqui é tipo um controle pra gente navegar entre as telas, sacou?
  const navigation = useNavigation();

  // useEffect é um treco q roda quando a tela carrega, só 1x por causa do []
  useEffect(() => {
    // função async pq pegar dados do banco demora, n pode travar a tela
    const loadData = async () => {
      try {
        console.log('receba na')
        // chama a função que pega as denúncias do banco, espera a resposta
        const data = await fetchDenuncias();
        // só debugando pra ver no console se veio certinho
        console.log('Dados do banco:', data);
        // aqui a gente coloca no estado pra renderizar na tela
        setDenuncias(data);
      } catch (error) {
        // se der erro mostrando no console pra gente debugar depois
        console.error('Erro ao carregar denúncias:', error);
      }
    };

    // chama a função q carrega os dados msm
    loadData();
  }, []); // o [] faz essa parada rodar só 1 vez, qnd a tela abrir

  // essa função é responsável por montar cada item da lista, tipo o "card" da denúncia
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Aqui a imagem da denúncia, passando a url q veio do banco */}
      <Image
        source={{ uri: item.imagemUri }}
        style={styles.imagem}
        resizeMode="cover" // faz a imagem preencher o espaço direito, cortando o q passar do limite
      />

      {/* Texto da descrição da denúncia */}
      <Text style={styles.descricao}>{item.descricao}</Text>

      {/* Texto que mostra a localização em latitude e longitude */}
      <Text style={styles.localizacao}>
        Local: {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
      </Text>

      {/* Data da denúncia, formatada pra padrão brasileiro */}
      <Text style={styles.data}>
        {new Date(item.data).toLocaleDateString('pt-BR')}
      </Text>

      {/* Aqui o mapa mini, mostrando o local da denúncia */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: item.latitude || -23.55052, // se não tiver latitude, usa São Paulo como padrão
          longitude: item.longitude || -46.633308,
          latitudeDelta: 0.01, // zoom vertical
          longitudeDelta: 0.01, // zoom horizontal
        }}
        scrollEnabled={false} // mapa fixo, não deixa mexer
        zoomEnabled={false}   // não deixa dar zoom tbm
      >
        {/* Se a denúncia tiver coordenada, mostra um marcador */}
        {item.latitude && item.longitude && (
          <Marker
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            title="Local da Denúncia" // texto q aparece quando clica no marcador
          />
        )}
      </MapView>
    </View>
  );

  // Aqui começa o que vai ser mostrado na tela
  return (
    <View style={{ flex: 1 }}>
      {/* Botão pra ir na tela de criar nova denúncia */}
      <View style={styles.botaoContainer}>
        <Button
          title="➕ Nova Denúncia"
          onPress={() => navigation.navigate('Nova Denúncia')}
          // o nome tem q ser exatamente igual ao q tá registrado lá no App.js
          color="#007AFF" // azulzinho padrão ios
        />
      </View>

      {/* Lista das denúncias, o FlatList é um componente eficiente pra listas longas */}
      <FlatList
        data={denuncias} // array de dados
        renderItem={renderItem} // função que monta cada item
        keyExtractor={item => item.id.toString()} // chave única pra cada item, tem q ser string
        contentContainerStyle={styles.container} // estilização do container
      />
    </View>
  );
}

// aqui são os estilos, igual css mas dentro do React Native
const styles = StyleSheet.create({
  container: {
    padding: 15, // espaçamento interno
    paddingBottom: 30, // mais espaçamento embaixo pra não ficar colado
  },
  botaoContainer: {
    marginTop: 10, // espaço em cima do botão
    paddingHorizontal: 15, // espaçamento nas laterais do botão
  },
  card: {
    backgroundColor: 'white', // fundo branco pra destacar
    borderRadius: 10, // cantos arredondados bonitinhos
    padding: 15, // espaçamento interno do card
    marginBottom: 15, // espaçamento em baixo entre os cards
    shadowColor: '#000', // sombra preta
    shadowOffset: { width: 0, height: 2 }, // sombra deslocada um pouco pra baixo
    shadowOpacity: 0.1, // opacidade da sombra
    shadowRadius: 4, // espalhamento da sombra
    elevation: 3, // sombra no Android
  },
  imagem: {
    width: '100%', // ocupa toda largura do card
    height: 200, // altura fixa de 200px
    borderRadius: 8, // cantinhos arredondados na imagem tbm
    marginBottom: 10, // espaço embaixo da imagem
  },
  descricao: {
    fontSize: 16, // texto um pouco maior
    fontWeight: 'bold', // negrito
    marginBottom: 5, // espaço embaixo da descrição
  },
  localizacao: {
    fontSize: 14, // texto menor
    color: '#555', // cinza escuro pra não gritar
    marginBottom: 3, // espaço pequeno embaixo
  },
  data: {
    fontSize: 12, // texto pequenininho
    color: '#777', // cinza mais claro
  },
  map: {
    width: '100%', // mapa ocupa a largura toda do card
    height: 150, // altura menor q a imagem
    borderRadius: 8, // cantinhos arredondados no mapa
    marginTop: 10, // espaço em cima do mapa
  },
});
