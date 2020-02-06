# PaymentServiceProvider

Autor: Guilherme Santana de Andrade

Descrição: API em Node.Js com banco de dados PostgreSQL.


# Ambiente de Produção

A API encontra-se disponível na nuvem, podendo ser utilizada a partir da url: https://payment-service-provider.herokuapp.com

O Banco de dados PostgresSQL de produção está na nuvem do serviço ElephantSQL.

# Ambiente de desenvolvimento

Para utilização em desenvolvimento seguir os seguintes passos:
- ter o PostgresSQL instalado e ativo localmente
- realizar o clone do projeto
- criar na raiz do projeto um arquivo não-versionado com o nome .env e o seguinte contéudo:

	DATABASE_DIALECT=postgres

	DATABASE_HOST=localhost

	DATABASE_PORT=5432

	DATABASE_USERNAME=postgres

	DATABASE_PASSWORD=postgres

	DATABASE_DATABASE=psp
- rodar no terminal os seguintes comandos: 
- npm install
- npm run sequelize-create
- npm run sequelize-migrate
- npm run start

Para testes automatizados:
- criar na raiz do projeto um arquivo não-versionado com o nome .env.test podendo(ou não) repetir o contéudo do .env:

	DATABASE_DIALECT=postgres

	DATABASE_HOST=localhost

	DATABASE_PORT=5432

	DATABASE_USERNAME=postgres

	DATABASE_PASSWORD=postgres

	DATABASE_DATABASE=psp
- rodar no terminal o seguinte comando:
- npm run test

# Usuário admin
Username: ROOT

key: ROOT (obs: Importante ressaltar que no authenticate a KEY deve ser passada como base64)

Então para equivaler a palavra ROOT usar: Uk9PVA==

# Rotas disponíveis
A grande maioria das rotas exigem TOKEN para serem utilizadas.

Para isso, iniciar o fluxo pelo /users/authenticate informando no body o acesso disponibilizado no item anterior.

Importante ressaltar que as rotas com a marcação [needAuthenticate-OnlyAdmin] só são autorizadas para usuário ADMINs.

O usuário padrão ROOT é um usuário admin, então poderá ser utilizado para acesso nestas rotas.


GET: /ambients 		[needAuthenticate-OnlyAdmin]

GET: /ambients/:id 	[needAuthenticate-OnlyAdmin]

POST: /ambients		[needAuthenticate-OnlyAdmin]


POST: /users/authenticate

GET: /users			[needAuthenticate-OnlyAdmin]

GET: /users/:id		[needAuthenticate-OnlyAdmin]

POST: /users		[needAuthenticate-OnlyAdmin]


GET: /payment_types		[needAuthenticate-OnlyAdmin]

GET: /payment_types/:id [needAuthenticate-OnlyAdmin]

POST: /payment_types	[needAuthenticate-OnlyAdmin]


GET: /transactions						[needAuthenticate-OnlyAdmin]

GET: /transactions$username=:USERNAME	[needAuthenticate]

GET: /transactions/:guid				[needAuthenticate]

POST: /transactions						[needAuthenticate]


GET: /payables$username=:USERNAME		[needAuthenticate]

GET: /payables/funds$username=:USERNAME	[needAuthenticate]

GET: /payables/:guid					[needAuthenticate]

POST: /payables/:guid/antecipate		[needAuthenticate]


# Postman Collections

Para facilitar a utilização das rotas, é recomendável utilizar as collections no POSTMAN.
(Serão encaminhadas para a Daniele Veiga)

# Observações importantes

Alguns dados precisam ser trafegados em base64. Nesse caso, utilizar um conversor como: https://www.base64encode.org/