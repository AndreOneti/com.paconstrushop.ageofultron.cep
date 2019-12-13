let soap = require('soap');

/**
 *  ? Para buscar o preço e prazo dos correios
 * @param {*} args { nVlPeso: string, nCdServico: string, sCepOrigem: sting, sCepDestino: string,  }
 */
function calcPrecoPrazo(args) {
  let arg = Object.assign({}, {
    sDsSenha: '',
    nCdEmpresa: '',
    sCdMaoPropria: 'N',
    nVlValorDeclarado: 0,
    sCdAvisoRecebimento: 'N'
  }, args);

  return new Promise((resolve, reject) => {
    soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl', async (error, client) => {
      if (error) return reject(error);
      return await client.CalcPrecoPrazo(arg, (error, result) => {
        if (!error
          && result && result.CalcPrecoPrazoResult
          && result.CalcPrecoPrazoResult.Servicos
          && result.CalcPrecoPrazoResult.Servicos.cServico) {
          // console.log(result.CalcPrecoPrazoResult.Servicos.cServico);
          return resolve(result.CalcPrecoPrazoResult.Servicos.cServico)
        }
        return reject(error);
      });
    });
  });
}

module.exports = {
  calcPrecoPrazo
};
