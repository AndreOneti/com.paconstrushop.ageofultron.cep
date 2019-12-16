const { appendFile, readFile } = require('fs');
let { calcPrecoPrazo } = require('./precoPrazo');
const csvjson = require('csvjson');

// let peso = 1.001;
// let pesoMax = 5;
// let estado = 'RR';
// let servico = ['04510' /* PAC à vista */, '04014' /* SEDEX à vista */];
let origem = '37553091';
let bodyJson = {};

// * Leitura do arquivo csv e chamada da função correiosGet.
// function start() {
//   readFile('./../default_locations.csv', 'utf-8', async (err, fileContent) => {
//     if (err) {
//       return null;
//     }
//     const jsonObj = csvjson.toObject(fileContent)
//       .filter(estate => estate.region === estado);

//     for (let i = 0; i < servico.length; i++) {
//       for (let pesoAtual = 0; pesoAtual < pesoMax; pesoAtual++) {
//         for (let index = 0; index < jsonObj.length; index++) {
//           let args = {
//             nVlPeso: peso + pesoAtual,
//             nCdServico: servico[i],
//             sCepOrigem: origem,
//             sCepDestino: jsonObj[index].start_zipcode
//           }
//           await precoPrazo(args, jsonObj[index].region);
//         }
//       }
//     }
//     console.info('Execution time: %dms', new Date() - start);
//   });
// }

// * Adiciona o retorno dos correios ao arquivo para manejamento depois
function writeToJsonFile(data, fileName) {
  appendFile(`/home/lucas/Área de Trabalho/Andre/codes/com.paconstrushop.ageofultron.cep/data/${fileName}.json`, data, function (err) {
    if (err) {
      throw err;
    }
  });
}

// * Escreve no arquivo de log se foi salvo ou deu erro no determinado cep
function writeLogFile(data, file) {
  appendFile(file, data, function (err) {
    if (err) {
      throw err;
    }
  });
}

// * Faz a busca do preço/prazo dos correios
async function precoPrazo(args, region, pesoMin, pesoMax, start, end, city) {
  return await calcPrecoPrazo(args)
    .then(result => {
      let response = {};
      response[`${args.nCdServico === '04510'
        ? "PAC"
        : args.nCdServico === '04014'
          ? "SEDEX"
          : "indisponivel"}-${Math.floor(args.nVlPeso)}kg-${start}-${end}`] = {
          region,
          city,
          "start_zipcode": start,
          "end_zipcode": end,
          "weight": args.nVlPeso,
          "maxWeigth": pesoMax,
          "term": result[0].PrazoEntrega,
          "price": result[0].Valor,
          "service": `${args.nCdServico === '04510'
            ? "PAC"
            : args.nCdServico === '04014'
              ? "SEDEX"
              : "indisponivel"}`,
          "update": `${new Date().toLocaleString().split(' ')[0].replace(/-/g, '')}`
          //   "table": "NORMAL",
        }
      if (result[0].Erro === '0') {
        // writeToJsonFile(JSON.stringify(response), `${args.nCdServico === '04510'
        //   ? "PAC"
        //   : args.nCdServico === '04014'
        //     ? "SEDEX"
        //     : "indisponivel"}_${Math.floor(pesoMin)}kg_${pesoMax}kg_${new Date().toLocaleString().split(' ')[0].replace(/-/g, '')}_backup`);
      }
      else {
        writeLogFile(`Erro - ${args.sCepDestino} Not enabled to save!\n`, '/home/lucas/Área de Trabalho/Andre/codes/com.paconstrushop.ageofultron.cep/logs/err.log');
        if (args.sCepDestino <= +end) precoPrazo({
          ...args,
          sCepDestino: +args.sCepDestino + 1
        }, region, pesoMin, pesoMax, start, end);
      }
      return response;
    }).catch(error => {
      console.log(error);
      return null;
    });
}

function secondsToDhms(seconds) {
  seconds = Number(seconds / 1000);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var ms = Math.floor((seconds * 1000) % 1000);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second, " : " seconds, ") : "0 seconds, ";
  var msDisplay = ms > 0 ? ms + (ms == 1 ? " milisecond" : " miliseconds") : "0 miliseconds";
  return dDisplay + hDisplay + mDisplay + sDisplay + msDisplay;
}

module.exports = function start(servico, pesoMin, pesoMax, estado) {
  var start = new Date();
  readFile('/home/lucas/Área de Trabalho/Andre/codes/com.paconstrushop.ageofultron.cep/default_locations.csv', 'utf-8', async (err, fileContent) => {
    if (err) {
      console.log(`> Erro: ${err}`);
      return null;
    }
    let jsonObj;
    if (estado === undefined) {
      jsonObj = csvjson.toObject(fileContent)
    } else {
      jsonObj = csvjson.toObject(fileContent)
        .filter(estate => estate.region === estado);
    }

    for (let i = 0; i < servico.length; i++) {
      bodyJson = {}
      for (let pesoAtual = pesoMin; pesoAtual <= pesoMax; pesoAtual++) {
        for (let index = 0; index < jsonObj.length; index++) {
          let args = {
            nVlPeso: +pesoAtual + 0.001,
            nCdServico: servico[i],
            sCepOrigem: origem,
            sCepDestino: jsonObj[index].start_zipcode
          }
          await precoPrazo(args, jsonObj[index].region, pesoMin, pesoMax, jsonObj[index].start_zipcode, jsonObj[index].end_zipcode, jsonObj[index].city)
            .then((response) => {
              let [key, value] = Object.entries(response)[0];
              bodyJson[key] = value;
              console.log(`> Response: ${key} - OK`);
            });
        }
      }
      writeToJsonFile(JSON.stringify(bodyJson, null, "  "), `${servico[i] === '04510'
        ? "PAC"
        : servico[i] === '04014'
          ? "SEDEX"
          : "indisponivel"}_${estado}_${Math.floor(pesoMin)}kg_${pesoMax}kg`);
    }
    console.info(`> Execution time: ${secondsToDhms(new Date() - start)}`);
  });
};
