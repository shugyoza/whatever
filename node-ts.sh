# WIP shell script for scaffolding

npm init -y

npm i cors dotenv
npm i nodemon --save-dev

npm i typescript ts-node @types/node @types/cors --save-dev
npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev

npx eslint --init
npx tsc --init

npm i mysql
npm install -D @types/mysql

# brew services start mysql # this is for latest mysql
# brew services start mysql@8.0
# mysql -u root
# $ mysql.server start
# $ mysql.server stop

# https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
# mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# Query OK, 0 rows affected (0.00 sec)

# mysql> flush privileges;
# Query OK, 0 rows affected (0.01 sec)