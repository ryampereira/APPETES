import { openDatabase } from '../database/database'; // Ajuste o caminho conforme necessário
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';



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

// Dashboard
 // dbservice.js
export const fetchScores = async (codAval) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log(`Buscando pontuação percentual para codAval: ${codAval}`);

    db.transaction(tx => {
      const query = `
        SELECT 
          iqeitem.CodInd, 
          peso.Pontuacao AS PontuacaoObtida,
          (SELECT MAX(p.Pontuacao)
           FROM avaliacaopeso p 
           WHERE p.CodInd = iqeitem.CodInd AND p.EhMaxima = 1
          ) AS PontuacaoMaxima
        FROM avaliacaoiqeitem iqeitem
        LEFT JOIN avaliacaopeso peso 
          ON iqeitem.CodInd = peso.CodInd AND iqeitem.CodAvalPeso = peso.CodAvalPeso
        WHERE iqeitem.CodAval = ?
      `;

      tx.executeSql(
        query,
        [codAval],
        (tx, results) => {
          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            const item = results.rows.item(i);
            const pontuacaoObtida = item.PontuacaoObtida || 0;
            const pontuacaoMaxima = item.PontuacaoMaxima || 1; // Evitar divisão por zero
            const porcentagem = (pontuacaoObtida / pontuacaoMaxima) * 100;

            items.push({
              CodInd: item.CodInd,
              Porcentagem: porcentagem,
            });
          }
          resolve(items);
        },
        (tx, error) => {
          console.error('Erro ao buscar pontuações percentuais:', error);
          reject(error);
        }
      );
    });
  });
};


// Dashboard Histórico

export const fetchHistory = async (codETE) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Buscando histórico de avaliações para a ETE:', codETE);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT a.DataVistoria, SUM(ap.Pontuacao) as totalPoints
         FROM avaliacaoiqe a
         JOIN avaliacaoiqeitem ai ON a.CodAval = ai.CodAval
         JOIN avaliacaopeso ap ON ai.CodAvalPeso = ap.CodAvalPeso
         WHERE a.CodETE = ?
         GROUP BY a.DataVistoria
         ORDER BY a.DataVistoria`,
        [codETE],
        (tx, results) => {
          console.log('Dados retornados:', results.rows._array);
          const historicalData = [];
          for (let i = 0; i < results.rows.length; i++) {
            historicalData.push({
              dataVistoria: results.rows.item(i).DataVistoria,
              totalPoints: results.rows.item(i).totalPoints,
            });
          }
          resolve(historicalData);
        },
        (tx, error) => {
          console.error('Erro ao buscar histórico de avaliações:', error);
          reject(error);
        }
      );
    });
  });
};

// Função para buscar o nome da ETE pelo CodAval
export const fetchEteNameByCodAval = async (codAval) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Buscando nome da ETE para a avaliação:', codAval);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT e.NomeETE
         FROM ete e
         JOIN avaliacaoiqe a ON e.CodETE = a.CodETE
         WHERE a.CodAval = ?`,
        [codAval],
        (tx, results) => {
          if (results.rows.length > 0) {
            const nomeETE = results.rows.item(0).NomeETE;
            resolve(nomeETE);
          } else {
            resolve(null); // Se não encontrar
          }
        },
        (tx, error) => {
          console.error('Erro ao buscar nome da ETE:', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchDataVistoriabyCodAval = async (codAval) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Buscando data vistoria para a avaliação:', codAval);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT a.DataVistoria
         FROM avaliacaoiqe a
         WHERE a.CodAval = ?`,  // Removido o JOIN
        [codAval],
        (tx, results) => {
          if (results.rows.length > 0) {
            const DataVistoria = results.rows.item(0).DataVistoria;
            resolve(DataVistoria);
          } else {
            resolve(null); // Se não encontrar
          }
        },
        (tx, error) => {
          console.error('Erro ao buscar data vistoria:', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchEteNameByCodETE = async (codETE) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log('Buscando nome da ETE para o CodETE:', codETE);

    db.transaction(tx => {
      tx.executeSql(
        `SELECT NomeETE
         FROM ete 
         WHERE CodETE = ?`,
        [codETE],
        (tx, results) => {
          if (results.rows.length > 0) {
            const nomeETE = results.rows.item(0).NomeETE;
            resolve(nomeETE);
          } else {
            resolve(null); // Se não encontrar
          }
        },
        (tx, error) => {
          console.error('Erro ao buscar nome da ETE:', error);
          reject(error);
        }
      );
    });
  });
};



const databaseName = 'bd.iqe.db';
const databasePath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;

// Função para exportar o banco de dados
export const exportDatabase = async () => {
    try {
        const fileUri = `${FileSystem.documentDirectory}${databaseName}`;

        // Verifica se o arquivo do banco de dados existe
        const dbExists = await FileSystem.getInfoAsync(databasePath);
        if (!dbExists.exists) {
            throw new Error('Banco de dados não encontrado.');
        }

        // Copia o banco de dados para um caminho acessível
        await FileSystem.copyAsync({
            from: databasePath,
            to: fileUri,
        });

        return fileUri; // Retorna o URI do arquivo exportado
    } catch (error) {
        throw new Error('Erro ao exportar o banco de dados: ' + error.message);
    }
};

// Função para importar o banco de dados
export const importDatabase = async (importUri) => {
    try {
        // Verifica se o arquivo de importação existe
        const fileExists = await FileSystem.getInfoAsync(importUri);
        if (!fileExists.exists) {
            throw new Error('Arquivo de importação não encontrado.');
        }

        // Copia o arquivo importado para o local do banco de dados
        await FileSystem.copyAsync({
            from: importUri,
            to: databasePath,
        });

        return true;
    } catch (error) {
        throw new Error('Erro ao importar o banco de dados: ' + error.message);
    }
};

const tables = ['municipio', 'indicador', 'resultadoavaliacao', 'ete', 'baciahidro', 'avaliadorinea', 'avaliacaopeso', 'avaliacaoiqeitem', 'avaliacaoiqe'];

export const fetchTablesData = async () => {
  const db = await initializeDb();
  const allData = {};

  return new Promise((resolve, reject) => {
      db.transaction(tx => {
          const tableFetchPromises = tables.map(table =>
              new Promise((res, rej) => {
                  tx.executeSql(
                      `SELECT * FROM ${table}`,
                      [],
                      (_, { rows }) => res({ table, data: rows._array }),
                      (_, error) => rej(error)
                  );
              })
          );

          Promise.all(tableFetchPromises)
              .then(results => {
                  results.forEach(({ table, data }) => {
                      allData[table] = data;
                  });
                  resolve(allData);
              })
              .catch(error => reject(error));
      });
  });
};


export const exportToXLSXUnified = async () => {
  try {
    // Inicializa o banco de dados
    const db = await initializeDb();

    // Query SQL
    const query = `
      SELECT E.NomeETE, M.NomeMun, A.DataVistoria, A.AnoBase, AI.NomeAvaliador, I.DescrInd, RA.DescrResAval, AP.Pontuacao
      FROM avaliacaoiqe A
      LEFT JOIN ete E ON A.CodETE = E.CodETE
      LEFT JOIN avaliadorinea AI ON AI.CodAvaliador = A.CodAval
      LEFT JOIN avaliacaoiqeitem AII ON A.CodAval = AII.CodAval
      LEFT JOIN avaliacaopeso AP ON AII.CodAvalPeso = AP.CodAvalPeso
      LEFT JOIN resultadoavaliacao RA ON RA.CodResAval = AP.CodResAval
      LEFT JOIN municipio M ON M.CodMun = E.CodMun
      LEFT JOIN indicador I ON I.CodInd = AII.CodInd
      ORDER BY 1, 3, 6
    `;

    // Log para verificar a consulta SQL
    console.log("Consulta SQL:", query);

    // Executar a consulta SQL dentro de uma transação
    const data = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(query, [], (tx, results) => {
          const rows = results.rows._array; // Acesse diretamente a propriedade _array
          
          // Log para verificar os dados retornados
          console.log("Resultados da consulta SQL:", rows);

          if (rows.length > 0) {
            resolve(rows);  // Retornar os dados se houver registros
          } else {
            reject(new Error("Nenhum dado encontrado na consulta SQL."));
          }
        }, (tx, error) => {
          reject(error);  // Caso ocorra algum erro na execução
        });
      });
    });

    // Verificar se há dados
    if (data.length > 0) {
      // Converter os dados para planilha XLSX
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DadosExportados");

      // Gerar o arquivo XLSX
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: "xlsx" });

      // Definir o caminho para salvar o arquivo
      const fileUri = `${FileSystem.documentDirectory}dados_unificados.xlsx`;

      // Salvar o arquivo no dispositivo
      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      console.log('Arquivo XLSX exportado com sucesso:', fileUri);
      return fileUri;
    } else {
      throw new Error('Nenhum dado encontrado na consulta SQL.');
    }
  } catch (error) {
    console.error('Erro ao exportar para XLSX:', error);
    throw error;
  }
};
