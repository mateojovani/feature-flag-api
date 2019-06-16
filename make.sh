#!/bin/bash

clean() {
  stop_existing
  remove_stopped_containers
  remove_unused_volumes
}

run() {
  echo "Cleaning..."
  clean

  echo "Running docker..."
  docker-compose up --build
}

stop_existing() {
  FFLAG="$(docker ps --all --quiet --filter=name=featflag)"
  MONGO="$(docker ps --all --quiet --filter=name=mongo)"
  REDIS="$(docker ps --all --quiet --filter=name=redis)"

  if [ -n "$FFLAG" ]; then
    docker stop $FFLAG
  fi

  if [ -n "$REDIS" ]; then
    docker stop $REDIS
  fi

  if [ -n "$MONGO" ]; then
    docker stop $MONGO
  fi
}

remove_stopped_containers() {
  CONTAINERS="$(docker ps -a -f status=exited -q)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all stopped containers."
		docker rm $CONTAINERS
	else
		echo "There are no stopped containers to be removed."
	fi
}

remove_unused_volumes() {
  CONTAINERS="$(docker volume ls -qf dangling=true)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all unused volumes."
		docker volume rm $CONTAINERS
	else
		echo "There are no unused volumes to be removed."
	fi
}

if [ $1 = "run" ]; then
	run
	exit
fi
