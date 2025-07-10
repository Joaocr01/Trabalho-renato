import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Tente carregar o MapView dinamicamente
let MapView;
try {
  MapView = require('react-native-maps').default;
} catch (e) {
  console.warn("react-native-maps não está disponível");
}

export default function DetalhesScreen({ route }) {
  const { denuncia } = route.params;

  return (
    <View style={styles.container}>
      {/* ... outros componentes ... */}

      {MapView ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: denuncia.latitude,
            longitude: denuncia.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: denuncia.latitude,
              longitude: denuncia.longitude,
            }}
            title="Local da denúncia"
          />
        </MapView>
      ) : (
        <View style={styles.mapFallback}>
          <Text>Mapa não disponível</Text>
          <Text>Latitude: {denuncia.latitude.toFixed(6)}</Text>
          <Text>Longitude: {denuncia.longitude.toFixed(6)}</Text>
        </View>
      )}
       <Button
                title="➕ Nova Denúncia"
                onPress={() => navigation.navigate('Nova Denúncia')}
                // o nome tem q ser exatamente igual ao q tá registrado lá no App.js
                color="#007AFF" // azulzinho padrão ios
              />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... outros estilos ...
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
});
