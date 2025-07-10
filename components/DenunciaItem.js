import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Esse componente Denunciation é tipo um cartãozinho que mostra uma denúncia só,
// ele recebe o item (dados da denúncia) e duas funções: onPress (quando clica no cartão) e onDelete (quando clica no botão excluir)
export default function Denunciation({ item, onPress, onDelete }) {
  return (
    // TouchableOpacity é um botão q pode ter opacidade ao clicar, aqui envolve tudo o cartão pra ser clicável
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Mostra a descrição da denúncia, em negrito e tamanho maior */}
      <Text style={styles.descricao}>{item.descricao}</Text>

      {/* Aqui tem uma linha com a latitude/longitude e a data, do lado a lado */}
      <View style={styles.infoContainer}>
        {/* Mostra as coordenadas formatadas com 6 casas decimais */}
        <Text style={styles.coords}>
          {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
        </Text>
        {/* Data da denúncia formatada para pt-BR */}
        <Text style={styles.data}>
          {new Date(item.data).toLocaleDateString('pt-BR')}
        </Text>
      </View>

      {/* Botãozinho de excluir, fica no canto direito */}
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Excluir</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', // fundo branco pra destacar o cartão
    borderRadius: 10,        // cantinhos arredondados pra ficar bonito
    padding: 15,             // espaço dentro do cartão pra tudo não ficar grudado
    marginBottom: 15,        // espaço entre cada cartão na lista
    shadowColor: '#000',     // sombra preta, pra dar profundidade
    shadowOffset: { width: 0, height: 2 }, // sombra um pouco pra baixo
    shadowOpacity: 0.1,      // sombra bem clarinha
    shadowRadius: 4,         // espalhamento da sombra
    elevation: 3,            // sombra pra Android
  },
  descricao: {
    fontSize: 16,            // texto maior pra descrição
    fontWeight: '600',       // negrito suave
    marginBottom: 10,        // espaço embaixo da descrição
    color: '#333',           // cor escura mas não preta pra não cansar
  },
  infoContainer: {
    flexDirection: 'row',          // deixa os textos na horizontal
    justifyContent: 'space-between', // espaço entre as coordenadas e a data
    marginBottom: 10,              // espaçamento embaixo da linha de infos
  },
  coords: {
    fontSize: 14,              // texto menor pras coordenadas
    color: '#1976d2',          // azulzinho pra destacar
    flex: 1,                   // ocupa o máximo possível pra empurrar a data pra direita
  },
  data: {
    fontSize: 14,              // mesmo tamanho da coordenada
    color: '#757575',          // cinza médio pra data não chamar tanto atenção
  },
  deleteButton: {
    alignSelf: 'flex-end',     // coloca o botão no canto direito do cartão
    backgroundColor: '#ff5252',// vermelho bem chamativo pra excluir
    paddingVertical: 6,        // altura do botão
    paddingHorizontal: 12,     // largura do botão
    borderRadius: 5,           // cantinhos arredondados no botão
  },
  deleteText: {
    color: '#fff',             // texto branco no botão vermelho pra contrastar
    fontWeight: '500',         // negrito médio
  },
});
