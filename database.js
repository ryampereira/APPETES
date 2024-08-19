import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite/legacy';
import { Asset } from 'expo-asset';

// export async function openDatabase() {
//   if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
//     await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
//   }
//   const asset = await Asset.fromModule(require('./src/Assets/bd_iqe.db')).downloadAsync();
//   await FileSystem.copyAsync({
//     from: asset.localUri,
//     to: FileSystem.documentDirectory + 'SQLite/bd_iqe.db',
//   });
//   return SQLite.openDatabase('bd_iqe.db');
// }

// export const db = openDatabase().then((response) => {
//   response._db.exec(
//     [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }],
//     false,
//     () => console.log('Foreign keys turned on'),
//   )
//   return response
// })

export async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  const asset = await Asset.fromModule(require('./src/Assets/bd_iqe2.db')).downloadAsync();
  await FileSystem.copyAsync({
    from: asset.localUri,
    to: FileSystem.documentDirectory + 'SQLite/bd_iqe2.db',
  });
  const db = SQLite.openDatabase('bd_iqe2.db');
  db._db.exec(
    [{ sql: 'PRAGMA foreign_keys = ON;', args: [] }],
    false,
    () => console.log('Foreign keys turned on')
  );
  return db;
}


//Abre o banco de dados
// const db = SQLite.openDatabaseAsync(
//   {
//     name: 'bd_iqe.db',
//     location: 'default',
//   },
//   () => {},
//   error => {
//     console.log('Error opening database: ', error);
//   }
// );

// export default db;