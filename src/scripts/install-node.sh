#!/bin/bash
wget https://nodejs.org/dist/v8.11.3/node-v8.11.3.tar.gz

tar -zxvf node-v8.11.3.tar.gz

cd node-v8.11.3

./configure

make -j4

sudo make install

