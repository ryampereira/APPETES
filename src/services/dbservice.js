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

// Dashboard
export const fetchScores = async (codAval) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {
    console.log(`Buscando pontuações e pontuação máxima para codAval: ${codAval}`);

    db.transaction(tx => {
      const query = `
        SELECT 
          avaliacaoiqeitem.CodInd, 
          avaliacaoiqeitem.CodAvalPeso, 
          peso.Pontuacao AS PontuacaoObtida,
          (SELECT MAX(p.Pontuacao) 
           FROM avaliacaopeso p 
           WHERE p.CodInd = avaliacaoiqeitem.CodInd AND p.EhMaxima = 1
          ) AS PontuacaoMaxima
        FROM avaliacaoiqeitem 
        LEFT JOIN avaliacaopeso peso 
          ON avaliacaoiqeitem.CodInd = peso.CodInd AND avaliacaoiqeitem.CodAvalPeso = peso.CodAvalPeso
        WHERE avaliacaoiqeitem.CodAval = ?
      `;

      tx.executeSql(
        query,
        [codAval],
        (tx, results) => {
          console.log('Dados retornados:', results.rows._array);
          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push({
              CodInd: results.rows.item(i).CodInd || 0,  // Adiciona valor padrão
              CodAvalPeso: results.rows.item(i).CodAvalPeso !== null ? results.rows.item(i).CodAvalPeso : 0,
              PontuacaoMaxima: results.rows.item(i).PontuacaoMaxima || 0,
            });
          }
          resolve(items);
        },
        (tx, error) => {
          console.error('Erro ao buscar pontuações e pontuação máxima:', error);
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