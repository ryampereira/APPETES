import { openDatabase } from '../database/database'; // Ajuste o caminho conforme necessário

let dbPromise;

// Mapeamento das colunas de identificação por tabela
const tableIdColumns = {
  municipio: 'CodMun',
  baciahidro: 'CodBacia',
  ete: 'CodETE',
  avaliacaoiqe: 'CodAval',
  avaliacaoiqeitem: ['CodAval', 'CodInd', 'CodAvalPeso'], // chave primária composta
  avaliadorinea: 'CodAvaliador',
  resultadoavaliacao: 'CodResAval',
  indicador: 'CodInd',
  avaliacaopeso: ['CodAvalPeso', 'CodResAval', 'CodInd'] // chave primária composta
};

// Inicializa o banco de dados
const initializeDb = async () => {
  if (!dbPromise) {
    dbPromise = openDatabase().then(db => {
      console.log('Banco de dados inicializado com sucesso');
      return db;
    }).catch(error => {
      console.error('Erro ao inicializar o banco de dados:', error);
      throw error;
    });
  }
  return dbPromise;
};

// Função para inserir dados
export const inclui = async (table, data) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Incluindo dados na tabela:', table);
    console.log('Dados a serem inseridos:', data);

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO ${table} (${Object.keys(data).join(', ')}) VALUES (${Object.keys(data).map(() => '?').join(', ')})`,
        Object.values(data),
        (tx, results) => {
          console.log('Dados inseridos com sucesso:', results);
          resolve(results);
        },
        (tx, error) => {
          console.error('Erro ao inserir dados:', error);
          reject(error);
        }
      );
    });
  });
};

// Função para atualizar dados
export const atualiza = async (table, id, data) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Atualizando dados na tabela:', table);
    console.log('Dados a serem atualizados:', data);

    const setString = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const idColumns = tableIdColumns[table];

    // Verifica se é uma chave primária composta
    const whereString = Array.isArray(idColumns)
      ? idColumns.map(col => `${col} = ?`).join(' AND ')
      : `${idColumns} = ?`;

    const idValues = Array.isArray(idColumns) ? id : [id];

    db.transaction(tx => {
      tx.executeSql(
        `UPDATE ${table} SET ${setString} WHERE ${whereString}`,
        [...Object.values(data), ...idValues],
        (tx, results) => {
          console.log('Dados atualizados com sucesso:', results);
          resolve(results);
        },
        (tx, error) => {
          console.error('Erro ao atualizar dados:', error);
          reject(error);
        }
      );
    });
  });
};

// Função para excluir dados
export const exclui = async (table, id) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Excluindo dados da tabela:', table);
    console.log('ID a ser excluído:', id);

    const idColumns = tableIdColumns[table];

    // Verifica se é uma chave primária composta
    const whereString = Array.isArray(idColumns)
      ? idColumns.map(col => `${col} = ?`).join(' AND ')
      : `${idColumns} = ?`;

    const idValues = Array.isArray(idColumns) ? id : [id];

    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM ${table} WHERE ${whereString}`,
        idValues,
        (tx, results) => {
          console.log('Dados excluídos com sucesso:', results);
          resolve(results);
        },
        (tx, error) => {
          console.error('Erro ao excluir dados:', error);
          reject(error);
        }
      );
    });
  });
};

// Função para buscar todos os dados
export const buscaTodos = async (table) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Buscando todos os dados da tabela:', table);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${table}`,
        [],
        (tx, results) => {
          console.log('Dados retornados:', results.rows._array);
          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => {
          console.error('Erro ao buscar dados:', error);
          reject(error);
        }
      );
    });
  });
};

export const buscaPergunta = async () => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT I.CodInd, DescrInd, DescrResAval, Pontuacao
          FROM resultadoavaliacao R
          INNER JOIN avaliacaopeso A ON A.CodResAval = R.CodResAval
          INNER JOIN indicador I ON A.CodInd = I.CodInd
          Order By I.CodInd, A.CodAvalPeso;
        `
		  ,
        [],
        (tx, results) => {
          console.log('Dados retornados:', results.rows._array);
          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => {
          console.error('Erro ao buscar dados:', error);
          reject(error);
        }
      );
    });
  });
}

export const criaPerguntaEmAvaliacaoItem = async (codInd) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql(
        `
          INSERT INTO avaliacaoiqeitem (CodInd, CodAvalPeso, LinkDoc, DescrDoc, PhotoURL)
          VALUES (?, null, null, null, null);
        `
		  ,
        [codInd],
        (tx, results) => {
          // console.log('Dados retornados:', results.rows._array);
          // const items = [];
          // for (let i = 0; i < results.rows.length; i++) {
          //   items.push(results.rows.item(i));
          // }
          resolve(items);
        },
        (tx, error) => {
          console.error('Erro ao buscar dados:', error);
          reject(error);
        }
      );
    });
  });
}

export const mostrarAvaliacaoItem = async () => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT * FROM avaliacaoiqeitem;
        `
		  ,
        [],
        (tx, results) => {
          console.log('=======================Todos os dados de avaliacao item=================\n\n:', results.rows._array);
          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => {
          console.error('Erro ao buscar dados:', error);
          reject(error);
        }
      );
    });
  });
}