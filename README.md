# Tutorial para construir seu primeiro pipeline com Continuous Integration e Continuous Deployment

Este repositório está com todos os artefatos para configurar o pipeline fazer o deploy, sendo somente necessário a troca das informações de autenticação das ferramentas que serão utilizadas. Recomendo que você monte um repositório a parte para execução desses passos afim de acompanhar e executar cada etapa de aprendizado da proposta do tutorial.
### 1. Ter ou Construir uma aplicação para fazer CI/CD
Eu criei uma aplicação simples Javascript para rodar este tutorial, se você quiser usar uma aplicação existente ou outra linguagem, sinta-se a vontade. Mas para garantir a execução do tutorial até o último passo, recomendo usar o que estou recomendando, e posterior aplique o mesmo tutorial para uma outra aplicação e/ou outra linguagem de programação.
Nesse tutorial utilizarei um repositório git que está hospedado no GitHub, mas é possível usar repositórios git de outros lugares (GitLab, BitBucket, etc).

### 2. Criar/Configurar uma conta do Heroku

Se você ainda não possui uma conta no Heroku, siga os seguintes passos:

1. Acesse o site no seu navegador de preferência: https://heroku.com
2. Clique em Sign-Up para criar a sua conta
3. Preencha os seus dados, e utilize um e-mail que você tenha acesso constantemente. Nos campos de _Company_ e Role, tu pode preencher __PretaLab__ e _Student_ respectivamente. No campo de __Primary development language__ você pode preencher a linguagem de sua preferência e caso já tenha uma aplicação na liguagem escolhida, porém isso pode ser alterado posteriormente. Nesse tutorial faremos um deploy de uma aplicação Node.js e clique em Create Free Account.
4. Confirme o seu cadastro acessando a conta de e-mail informado e procure um e-mail com o título __Confirm your account on Heroku__, e clique no link para confirmar sua conta, defina uma senha e confirme.
5. Se tu ver na tua tela a mensagem __Welcome to Heroku__, prossiga para o acesso do Heroku, aceite os termos de serviço e avance.
6. Quando visualizar dois botões __Create new app__ e __Create a team__, estamos prontas para começar :)!

## 3. Criar/configurar conta do serviço de CI

Existem um vasto leque de opções de CI gratuitos para utilizar-mos. Neste tutorial eu vou usar o mais simples que conheço (e mais fácil de aprender) chamado [Travis-CI](https://www.travis-ci.com/).

1. Acesse o site e clique em sign-up, serão exibidas as opções para login, muitas delas com autenticação de serviços que hospedam repositórios Git, vamos utilizar a autenticação do GitHub.
2. Após autenticar, a página será direcionada para a página de pipelines executados (se você nunca utilizou, estará vazia), do lado direito superior terá um ícone do seu perfil, abra e clique na opção __Settings__.
3. Na tela exibida, clique a Aba _Repositories_, clique no botão __Manage repositories on GitHub__, a tela de permissões de integrações com o GitHub será aberta numa nova aba, selecione a opção _Only selected repositories_, clique no botão __Select repositories__, pesquise seu repositório git no GitHub para este projeto rodar o CI, no meu caso eu coloquei _pretalab-ci-cd-tutorial_.
4. Assim que surgir o projeto escolhido, clique para selecioná-lo, logo depois clique no botão em verde no final da tela __Approve and Install__.
5. Se abrir a tela do Travis-CI com o seu repositório listado, estamos prontas :)!

### 3. Configurar o build da aplicação

Nesta etapa vamos criar o arquivo de configuração do CI, no nosso caso, o arquivos que o Travis-CI precisa para executar o pipeline do nosso projeto.

1. Crie um arquivo na raiz do projeto chamado `.travis.yml`
2. No arquivo vamos informar os dados necessários para a executar o disparo do pipeline:

```yaml
language: node_js
os: linux
node_js:
  - 14
jobs:
  include:
    - stage: build
      name: Build da aplicação JavaScript
      script: npm install
```

3. Aqui nessa configurações definições fundamentais para funcionar nosso primeiro passo do CI, no caso a instalação da nossa aplicação JavaScript: (1) Qual runtime vamos usar, no caso _NodeJS_; (2) qual sistema operacional que será executado os scripts do nosso pipeline, no caso Linux; (3) qual a versão do Node.JS, no caso versão 14; e nosso primeiro passo (_stage_) definido como _build_, onde nomeie como __Build da aplicação JavaScript__ e define no _script_ o comando executado para instalar nossa aplicação `npm install`. Após essa configuração, commit este arquivo e acompanho a execução do pipeline na página principal do Travis-CI.
ATENÇÃO: O arquivo de configuração por começar com um ponto `.travis.yml` é considerado como arquivo oculto, então se certifique de que o arquivo foi adicionado e commitado no repositório.
4. Abra a tela do Travis-CI e verifique se o seu pipeline foi iniciado, deve aparecer como amarelo se estiver executando ainda e verde para completa, vermelha no caso de algum erro. Se estiver verdinha, estamos prontas nessa etapa :)!

### 4. Configurar o Deploy
Nesta etapa vamos configurar o deploy dessa aplicação no Heroku, e o Travis-CI que vai colocar a aplicação no Heroku para nós!

1. Vá no dashboard do Heroku e clique no botão __Create new App__. No formulário que for exibido, coloque o nome da aplicação seguido do seu nome, garantindo que seja uma aplicação única no Heroku, _pretalab-ci-cd-<seunome>_ e o país onde será feito o deploy, preencha _United States_, e clique em __Create app__;

2. Pegue a chave de autenticação para o Travis-CI autenticar no Heroku. Acesse seu perfil do Heroku no canto direito superior da tela e clique em _Account Settings_. Na sessão _Account_ procure por uma sessão chamada _API Key_, nela, clique no botão _Reveal_ e copiei o conteúdo da chave, uma sequência aleatória de números e letras.

3. No Dashboard do Travis-CI, procure seu repositório e clique. No campo direito superior, clique no botão _ More options_ e selecione a opção _Settings_. Procure uma sessão chamada _Environments Variables_, e preencha os campos disponíveis: (1) Coloque o nome da variável `HEROKU_API` no campo _name_, usaremos para obter a API Key do Heroku sem que tenhamos que commitar seu valor no `.travis.yml`, evitando problemas de segurança ou roubo de identidade. (2) Preencha a API Key que copiamos no Heroku no campo _value_; (3) No campo _branch_ informe a branch, coloquei _master_ ; (4) Garanta que o campo _DISPLAY VALUE IN BUILD LOGS_ esteja desligado, para que o seu token não seja exibido nos logs do pipeline do Travis. Depois clique no botão _Add_ para que a variável seja criada.

4. Adicione a configuração do deploy no arquivo `.travis.yml`:

```yaml
language: node_js
os: linux
node_js:
  - 14
jobs:
  include:
    - stage: build
      name: Build da aplicação JavaScript
      script: npm install

deploy:
  provider: heroku
  api_key: $HEROKU_API
  app: pretalab-ci-cd-marylly
```

Nessa última sessão adicionada chamada _deploy_ dizemos que vamos deployar no Heroku (provider), a chave de autenticação usará o conteúdo da variável que criamos no Travis HEROKU_API (api_key) e informamos o nome da aplicação que criamos no Heroku (app).
Após isso, faça ao commit do arquivo `.travis.yml`, espere o pipeline executar e verifique no Heroku se o deploy aconteceu.

### 5. Linter

### 6. Testes de Unidade
