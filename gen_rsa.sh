#!/bin/bash

STORE_PATH="./fabric/config/crypto/prebaked"

openssl genrsa -out "${STORE_PATH}/rsa_key_priv.pem" 2048
openssl rsa -in "${STORE_PATH}/rsa_key_priv.pem" -out "${STORE_PATH}/rsa_key_pub.pem" -pubout 
