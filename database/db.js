import * as SQLite from 'expo-sqlite';

// Aqui a gente abre o banco de dados de forma assíncrona, usando o jeito novo do SDK 53 do Expo
// pra evitar problema de abrir o banco várias vezes, uso uma variável pra guardar a instância
let db;
export const openDB = async () => {
  if (!db) {
    // se ainda não abriu, abre o banco 'denuncias.db' (cria se não existir)
    db = await SQLite.openDatabaseAsync('denuncias.db');
    // ativa o modo WAL (Write-Ahead Logging), que deixa o banco mais rápido e menos travado
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
  }
  // devolve a instância do banco pra usar depois
  return db;
};

// Função que cria a tabela denuncias se ela ainda não existir
export const initDB = async () => {
  const db = await openDB();

  // execAsync executa vários comandos SQL de uma vez (mas cuidado, não escapa parâmetros, então usar só pra criar tabela aqui é seguro)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS denuncias (
      id INTEGER PRIMARY KEY NOT NULL, // id auto incrementado e chave primária
      descricao TEXT,                  // texto da denúncia
      imagemUri TEXT,                 // caminho/uri da imagem
      latitude REAL,                  // latitude do local
      longitude REAL,                 // longitude do local
      data TEXT                      // data da denúncia
    );
  `);
};

// Função que insere uma nova denúncia no banco, recebendo os dados por parâmetro
export const insertDenuncia = async (descricao, imagemUri, latitude, longitude, data) => {
  const db = await openDB();

  // runAsync é usado pra rodar query com parâmetros seguros, evita SQL Injection
  const result = await db.runAsync(
    `INSERT INTO denuncias (descricao, imagemUri, latitude, longitude, data)
    VALUES (?, ?, ?, ?, ?);`,
    descricao, imagemUri, latitude, longitude, data
  );

  // retorna o id da denúncia que acabou de ser inserida, útil se quiser usar depois
  return result.lastInsertRowId;
};

// Função que busca todas as denúncias do banco, ordenadas da mais recente pra mais antiga
export const fetchDenuncias = async () => {
  const db = await openDB();

  // getAllAsync retorna todas as linhas da consulta em forma de array de objetos
  const rows = await db.getAllAsync(`SELECT * FROM denuncias ORDER BY id DESC;`);
  return rows;
};

// Função que deleta uma denúncia pelo id
export const deleteDenuncia = async (id) => {
  const db = await openDB();

  // roda o delete com parâmetro seguro
  const result = await db.runAsync(`DELETE FROM denuncias WHERE id = ?;`, id);

  // retorna quantos registros foram afetados (deletados)
  return result.changes;
};
