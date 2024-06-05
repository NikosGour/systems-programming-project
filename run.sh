#!/usr/bin/env bash
# Store directories in a variable
directories="recommender data_generation"

# Print the directories
echo $directories

# copy .env file to each directory
for dir in $directories; do
	cp .env $dir
	( 
		cd $dir
		echo `pwd`
		tsc -b 
 	)
done


if [[ "$1" == "--build" ]]; then
	docker compose up --build
else
	docker compose up
fi