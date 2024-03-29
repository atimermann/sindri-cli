# Projeto Sindri Cli 

Conjuntos de scripts para auxiliar no desenvolvimento de projetos criados com Sindri Framework.

O principal script é o sindri-create, utilizado para criar projeto sindri framework, podemos executar 
necessidade de instalar o sindri-cri da seguinte forma:

```shell
    npx -y -p @agtm/sindri-cli sindri create
```

## Instalação

Caso prefira manter o SindriCli globalmente execute:

```
  npm i -g @agtm/sindri-cli
```
Para mais informação leia documentação do projeto Sindri Framework 2

## Instruções de Uso

Simplesmente execute o comando **sindri** no terminal e siga as instruções

**Exemplo:**
```
Usage: sindri [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      output usage information

Commands:
  create          Cria um novo projeto com os arquivos necessários utilizando o Sindri Framework.
  install-assets  Copia assets (arquivos estáticos) das apps para pasta public ou servidor CDN.
  build           Gera um binário da aplicação, agrupando vários arquivos em um unico arquivo executável. Protege código fonte condificandos utilizando a ferramenta node-pkg. Permitindo fácil distribuição comercial do projeto.
  create-app      Cria novo app baseado no template.
  help [cmd]      display help for [cmd]

Descrição:
  Conjuntos de scripts para auxiliar no desenvolvimento de projetos criados com Sindri Framework.


```

## Instruções de Atualização do sindri-cli (Guia de Desenvolvimento)

Ao atualizar o projeto verificar se foi atualizado a versão do:

* **pkg:** deve ser verificada a versão utilizada no sindri-framework ou seja a ultima (atualizar lá se necessário)
* **node:** PKG normalmente não está atualizado com a ultima versão do node, deve ser mantido a ultima versão compatível com pkg (veja documentação do sindri-framework)

**IMPORTANTE:** No arquivo modelo "template/project/package.json" necessário adicionar alguns modulos do node com 
incompatibilidade com pkg ou que por qualquer motivo não são adicionados automaticamente ao binario criado pelo pkg
ex: config

Testar criando novo projeto e testando a execução:
```
  node main.js
```
  
Compilação:
```
   npm run build
```

## Entendendo e configurando projeto para funcionar com PKG (Guiá rápido)

Alguns arquivos e modulos precisam ser inserido manualmente em assets no package.json, verifique documentação em:
https://github.com/vercel/pkg

## jsconfig.json

Configuração para o editor, permite que o webstorm reconheça alias por exemplo.

https://code.visualstudio.com/docs/languages/jsconfig

## Versões Testadas

* Sindri Cli@2.0.1 => Sindri Framework@2.0
* Sindri Cli@2.1.0 => Sindri Framework@2.1 => pkg@4.4.0
* Sindri Cli@2.2 => Sindri Framework@2.1.12 => pkg@4.4.0    
* Sindri Cli@2.5 => Sindri Framework@2.3 => pkg@4.5.1 (Node 14.17.6lls)

