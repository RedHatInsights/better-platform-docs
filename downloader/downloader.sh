#!/bin/bash
SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
INPUT=$SCRIPTPATH/config.csv
OLDIFS=$IFS
IFS=','
while read owner repo branch path
do
  curl -o /tmp/${repo}.zip https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip -O -J -L
  unzip /tmp/${repo}.zip -d /tmp
  rm -f /tmp/${repo}.zip
  rsync -a -v /tmp/${repo}-${branch}/${path} $SCRIPTPATH/../pages
  rm -rf /tmp/${repo}-${branch}
done < $INPUT
IFS=$OLDIFS
