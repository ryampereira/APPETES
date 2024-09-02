import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite/legacy'
import { Asset } from 'expo-asset';

let dbInstance = null;

export async function openDatabase() {
  try {
    if (dbInstance) {
      return dbInstance; // Retorna a instância existente se já foi inicializada
    }

    const dbDirectory = FileSystem.documentDirectory + 'SQLite/';
    const dbPath = dbDirectory + 'bd.iqe.db';

    // Verifica se o diretório já existe antes de tentar criá-lo
    const dirInfo = await FileSystem.getInfoAsync(dbDirectory);
    if (!dirInfo.exists) {
      console.log('Criando diretório do banco de dados:', dbDirectory);
      await FileSystem.makeDirectoryAsync(dbDirectory, { intermediates: true });
    }

    // Copia o arquivo do banco de dados se ele não existir
    const dbInfo = await FileSystem.getInfoAsync(dbPath);
    if (!dbInfo.exists) {
      console.log('Arquivo do banco de dados não encontrado. Copiando...');
      const asset = Asset.fromModule(require('../Assets/bd.iqe.db'));
      await asset.downloadAsync();
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbPath,
      });
      console.log('Arquivo do banco de dados copiado para:', dbPath);
    }

    // Abre o banco de dados usando o caminho persistente
    console.log('Abrindo banco de dados:', dbPath);
    dbInstance = SQLite.openDatabase('bd.iqe.db'); // Abre o banco a partir do caminho persistente

    // Ativa chaves estrangeiras
    dbInstance.transaction(tx => {
      tx.executeSql(
        'PRAGMA foreign_keys = ON;',
        [],
        () => console.log('Chaves estrangeiras ativadas com sucesso'),
        (tx, error) => console.error('Erro ao ativar chaves estrangeiras:', error)
      );
    });

    return dbInstance;
  } catch (error) {
    console.error('Erro ao abrir o banco de dados:', error);
    throw error;
  }
}

// Garantia de inicialização
openDatabase()
  .then(() => console.log('Banco de dados inicializado com sucesso'))
  .catch(error => console.error('Erro na inicialização do banco de dados:', error));
