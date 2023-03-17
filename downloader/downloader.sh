#!/bin/bash
SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
INPUT=`tail -n +1 $SCRIPTPATH/config.csv`
OLDIFS=$IFS
IFS=','
while read owner repo branch path folder
do
  DIR="/tmp/${repo}-${branch}"
  if [ -d "$DIR" ]; then
    echo "Using previous folder!"
  else
    curl -o /tmp/${repo}.zip https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip -O -J -L
    unzip /tmp/${repo}.zip -d /tmp
    rm -f /tmp/${repo}.zip
  fi
  
  FOLDER=`echo $folder | tr ' ' '-' | tr '[:upper:]' '[:lower:]'`
  if [ "$FOLDER" = "public" ]; then
    rsync -a -v /tmp/${repo}-${branch}/${path} $SCRIPTPATH/../public
  elif [ "$FOLDER" = "examples" ]; then
    rsync -a -v /tmp/${repo}-${branch}/${path} $SCRIPTPATH/../components
  else
    rsync -a -v /tmp/${repo}-${branch}/${path} $SCRIPTPATH/../pages/$FOLDER
  fi
done <<< $INPUT

while read owner repo branch
do
  rm -rf /tmp/${repo}-${branch}
done <<< $INPUT
IFS=$OLDIFS
