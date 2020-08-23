const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://smspetropolis.net.br/covid-19/");

  const dadosCovid = await page.evaluate(() => {    

    /// Pegar todos os dados de covid no container
    const nodeList = document.querySelectorAll("div.numCovid, p.cardsHome");

    /// Transformar o NodeList em array
    const arr = [...nodeList];

    /// Transformar os elementos em objetos js
    var elemento = [];

    for (let index = 0; index < arr.length; index++) {
      if (index % 2 != 0)
        elemento.push(
            {
              descricao: `${arr[index].innerText}`,
              casos: `${arr[index - 1].innerText}`  
            }
        );
    }

    return elemento;
  });
  
  /// Salvar os dados em um arquivo json
  fs.writeFile(
    "dados-covid-petropolis.json",
    JSON.stringify(dadosCovid, null, 2),
    (err) => {
      if (err) throw new Error("alguma coisa deu errado");
    }
  );
  
  await browser.close();
})();
