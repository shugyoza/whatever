#!bin/bash
# WIP shell script for scaffolding MySQL DB
MYSQL_DB_USERNAME="root"
MYSQL_DB_NAME="stoned"
# create new database
echo "create database $MYSQL_DB_NAME"
mysql -u $MYSQL_DB_USERNAME -p;