import React from 'react';
// Esse pacote é o container principal que gerencia toda a navegação da app
import { NavigationContainer } from '@react-navigation/native';
// Esse aqui cria uma pilha de telas (tipo histórico de telas), cada tela é uma "stack screen"
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa as telas q criamos, a principal e a de nova denúncia
import HomeScreen from './screens/homescreen';
import NovaDenunciaScreen from './screens/NovaDenunciaScreen';

// Cria a pilha de navegação
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    // O NavigationContainer envolve tudo e é obrigatório pra navegação funcionar
    <NavigationContainer>
      {/* Stack.Navigator organiza as telas em pilha */}
      <Stack.Navigator initialRouteName="Home">
        {/* Cada Stack.Screen é uma tela q a gente pode navegar */}
        <Stack.Screen
          name="Home" // nome que a gente usa pra chamar essa tela
          component={HomeScreen} // componente que será renderizado quando entrar nessa tela
        />
        <Stack.Screen
          name="Nova Denúncia" // nome da outra tela (tem q ser exatamente igual q vc usa na navegação)
          component={NovaDenunciaScreen} // componente da tela de criar denúncia
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
