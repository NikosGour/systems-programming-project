#!/usr/bin/env bash
directories="recommender data_generation data_storage"

echo $directories

# copy .env file to each directory
for dir in $directories; do
	cp .env $dir
done

(
	cd systems_programming_lib
	tsc -b
)