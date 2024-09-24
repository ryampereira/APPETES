import { openDatabase } from '../database/database'; // Ajuste o caminho conforme necessário

let dbPromise;

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

export const formataPerguntas = (dados) => {
  `
    Formata as informações obtidas pela função buscaPergunta para o formato abaixo:
    [
      {
        id: 1,
        title: "pergunta 1",
        respostas: [
          {
            texto: "resposta 1",
            codAvalPeso: 1,
            escolhida: true
          },
          ... demais respostas
        ]
      },
      ... demais perguntas
    ]
  `

  const perguntas = [];

  dados.forEach(item => {
      let pergunta = perguntas.find(p => p.titulo === item.DescrInd);

      if (!pergunta) {
          pergunta = {
            id: item.CodInd,
            titulo: item.DescrInd,
            respostas: []
          };
          perguntas.push(pergunta);
      }

      pergunta.respostas.push({
        texto: item.DescrResAval,
        codAvalPeso: item.CodAvalPeso,
        escolhida: item.Checked === 1 ? true : false 
      });
  });

  return perguntas;
};

export const buscaPerguntas = async (codAval) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT 
              I.CodInd, 
              I.DescrInd, 
              R.DescrResAval, 
              A.CodAvalPeso,
              CASE 
                  WHEN AI.CodAvalPeso IS NOT NULL THEN 1 
                  ELSE 0 
              END AS Checked
          FROM indicador I
          INNER JOIN avaliacaopeso A ON I.CodInd = A.CodInd
          INNER JOIN resultadoavaliacao R ON A.CodResAval = R.CodResAval
          LEFT JOIN avaliacaoiqeitem AI ON I.CodInd = AI.CodInd AND A.CodAvalPeso = AI.CodAvalPeso AND AI.CodAval = ?
          ORDER BY I.CodInd, A.CodAvalPeso;
        `
          ,
        [codAval],
        (tx, results) => {
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

export const criaPerguntaEmAvaliacaoItem = async (codAval, perguntas) => {
  const db = await initializeDb();

  return new Promise((resolve, reject) => {
    perguntas.map((pergunta) => {
      db.transaction(tx => {
        tx.executeSql(
          `
            INSERT INTO avaliacaoiqeitem (CodAval, CodInd, CodAvalPeso, LinkDoc, DescrDoc, PhotoURL)
            VALUES (?, ?, NULL, NULL, NULL, NULL);
          `
        ,
          [codAval, pergunta.id],
          (_, result) => {
            console.log(`Pergunta ${pergunta.id} de avaliacao ${codAval} inserida em avaliacaoiqeitem`);
            resolve(result)
          },
          (_, error) => {
            console.log('Erro ao inserir pergunta:', error);
            reject(error);
          }
        );
      });
    })

    
  });
  
}

export const resetarAvaliacaoItem = async (codAval) => {
  const db = await initializeDb();
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql(
        `
          DELETE FROM avaliacaoiqeitem WHERE CodAval = ?;
        `
          ,
        [codAval],
        (tx, results) => {
          console.log(`${results.rowsAffected} perguntas de avaliacao ${codAval} excluídos com sucesso de avaliaçãoiqeitem`);
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

export const verificaExistenciaPerguntas = async (codAval) => {  
  const db = await initializeDb();
  return new Promise((resolve, reject) => {

    db.transaction(tx => {
      tx.executeSql(
        `
          SELECT COUNT(*) as total FROM avaliacaoiqeitem WHERE CodAval = ?;
        `
          ,
        [codAval],
        (tx, results) => {
          console.log(`Total de perguntas já criadas para avaliação com código ${codAval}:`, results.rows.item(0).total);

          if(results.rows.item(0).total > 0){
            console.log(`Usando perguntas já cadastradas para avaliação com código ${codAval}`);
          }

          
          resolve(results.rows.item(0).total > 0);
        },
        (tx, error) => {
          console.error('Erro ao buscar dados:', error);
          reject(error);
        }
      );
    });
  });
};

export const atualizaResposta = async (codAval, codInd, codAvalPeso) => {
  const db = await initializeDb();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `
          UPDATE avaliacaoiqeitem
          SET CodAvalPeso = ?
          WHERE CodAval = ? AND CodInd = ?;
        `
          ,
        [codAvalPeso, codAval, codInd],
        (tx, results) => {
          console.log(`Resposta da pergunta ${codInd} e avaliacao ${codAval} atualizada com o peso ${codAvalPeso}`);

          const items = [];
          for (let i = 0; i < results.rows.length; i++) {
            items.push(results.rows.item(i));
          }
          resolve(items);
        },
        (tx, error) => {
          console.error("Erro ao atualizar a resposta no banco: ", error);
          reject(error);
        }
      );
    });
  });
};

export const salvaFoto = async (photoUrl, codInd, codAval) => {
  const db = await initializeDb();

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `
          UPDATE avaliacaoiqeitem SET PhotoURL=?
          WHERE CodInd = ? and CodAval = ?
        `,
        [photoUrl, codInd, codAval],
        (_, results) => {
          console.log(`Foto salva no banco de dados com indicador ${codInd} e avaliacao ${codAval}`)
        },
        (_, error) => reject(error)
      );
    });
  });
};