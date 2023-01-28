## Extrato Pix - Itau

Este projeto tem como objetivo extrair o extrato do pix do Itaú. (2 dias de extrato)

### Como usar

1. Baixe o projeto
2. Instale as dependências
3. Configure o arquivo .env
4. Execute o projeto

### Instalação

```bash
git clone https://github.com/rodriguesabner/itau-pix-extract.git

cd itau-pix-extract

yarn install
```

### Execução

```bash
yarn start
```

### Configuração

Entre no arquivo .env e altere os dados: **AGENCIA**, **CONTA** e **SENHA**.

Caso você queira ver o processo de raspagem rolando, basta alterar **HIDE_BROWSER** para false. 

### Como funciona

O projeto utiliza o puppeteer para simular a navegação do usuário no site do Itaú. Eu não armazeno nenhuma informação
remotamente, o projeto é 100% open source e você pode conferir o código fonte.

### Resultado

O resultado será um arquivo .csv com o extrato do pix. 

### Proposta do projeto

A ideia do projeto é verificar se um pgto de um cliente foi realizado usando **PIX**. 

O 'ideal' é que você forneça um QRCode para o seu cliente com um identificador **SEU** ou da **SUA EMPRESA**. E assim que o pagamento for feito, você pode consultar o extrato e verificar se o pagamento foi realizado por este cliente usando o identificador fornecido no momento do pgto.

### Projeto auxiliar

Para gerar um QRCode com identificador, você pode dar uma olhada nesse meu outro repositório:

https://github.com/rodriguesabner/pix-dinamico-reactjs
