# Systems Programming Recommendation Engine

### Description

A recommendation system based on a sports betting website. Developed for Uni course "Systems Programming"

## Requirements

You need to have Node.js and npm installed.
You also need to have TypeScript installed globally.
You will finally need docker compose install

## Run and Build

`./prerun.sh && docker compose up --build`

## Project Architecture

The project is divided into 2 big parts:
- The shared library
- The other projects

This is done to decouple the code and make it easier to maintain and test. Also the reason why the shared library is a separate project is to make it easier to share it with other projects, by that I mean that the shared library is the only dependency of the other projects and there is no dependency mess.

[pic](architecture.png)