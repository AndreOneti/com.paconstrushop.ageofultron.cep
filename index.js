const { appendFile, readFile } = require('fs');
// let Correios = require('node-correios');
const csvjson = require('csvjson');

// let correios = new Correios();

// let peso = '1';
// let emMaos = 'S'; // N
// let estado = 'AC';
// let servico = '04510'; // 04510 = PAC à vista - 04014 = SEDEX à vista
// let origem = '37553091';

// // * Leitura do arquivo csv e chamada da função correiosGet.
// readFile('./default_locations.csv', 'utf-8', async (err, fileContent) => {
//   if (err) {
//     return null;
//   }
//   const jsonObj = csvjson.toObject(fileContent);

//   for (let index = 0; index < jsonObj.length; index++) {
//     console.log(jsonObj[index].start_zipcode);
//     await correiosGet({
//       nVlPeso: peso,
//       sCdMaoPropria: emMaos,
//       nCdServico: servico,
//       sCepOrigem: origem,
//       sCepDestino: jsonObj[index].start_zipcode
//     });
//   }
// });

// // * Requisição de prazo e preço dos correios para o cep
// async function correiosGet(args) {
//   await correios.calcPrecoPrazo(args)
//     .then(result => {
//       let response = result[0];
//       response.sCepDestino = args.sCepDestino;
//       if (result[0].Erro === '0') writeToJsonFile(JSON.stringify(response));
//       else writeLogFile(`Erro - ${args.sCepDestino} Not enabled to save!\n`, 'err.log');
//       return;
//     })
//     .catch(error => {
//       return null;
//     });
// }

// // * Adiciona o retorno dos correios ao arquivo para manejamento depois
// function writeToJsonFile(data) {
//   appendFile('response.json', data + ',', function (err) {
//     if (err) {
//       throw err;
//     }
//     console.log('Saved!');
//     let { sCepDestino } = JSON.parse(data);
//     writeLogFile(`Success - ${sCepDestino} Save!\n`, 'ok.log');
//   });
// }

// // * Escreve no arquivo de log se foi salvo ou deu erro no determinado cep
// function writeLogFile(data, file) {
//   appendFile(file, data, function (err) {
//     if (err) {
//       throw err;
//     }
//   });
// }




readFile('./default_locations.csv', 'utf-8', async (err, fileContent) => {
  if (err) {
    return null;
  }
  const jsonObj = csvjson.toObject(fileContent);
  var regions = [];
  // regions.push({
  //   region: "AC",
  //   total: 1
  // });
  for (i = 0; i < jsonObj.length; i++) {
    if (regions.filter(reg => reg.region === jsonObj[i].region)[0] === undefined) {
      let region = jsonObj[i].region;
      let total = 1;
      regions.push({ region, total });
    } else {
      let region = jsonObj[i].region;
      regions.filter(reg => reg.region === region)[0].total = regions.filter(reg => reg.region === region)[0].total + 1;
    }
  }
  console.log(regions.sort((a, b) => (a.total > b.total) ? 1 : -1));
});
