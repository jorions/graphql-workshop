# GraphQL Workshop
A repo which demonstrates GraphQL basics.

## Basic Layout
The app contains a `start` and a `finish` folder.

The `start` folder contains the bones of the app, with select files left blank that we are going to fill out.

The `finish` folder contains the completed app, including comments and examples to help demonstrate additional concepts. Note that we even have an alternate User Service schema which demonstrates more schema concepts at `finish/db/schema_ALTERNATE.js`.

## Getting started
Note that if you want the `final` version of the app to work you'll need to do each of the below commands in the `final` folder too.

1. From the top level of this repo, enter the shell command (for Mac users) to install all dependencies and check out the first commit tag.
```
cd start && npm i && git checkout 1-setup
```

2. Copy the `start/.env.sample` file as `.env`.

3. From within the `start` folder run the npm command to create the `start/db/store.sqlite` file:
```
npm run db:create
```

## A Note About the Commit Tags
This repo's commit history is tagged at multiple points so that you can easily move from checkpoint to checkpoint in the app creation process. If you want to see a list of all of the tags in this repo type `git tag -l`.

## Related links
- [Presentation](https://docs.google.com/presentation/d/1mnaFye6Ib7Jihws93w0u2IIw6kU60pr_8kgkoHZMjlI/edit?usp=sharing)
- [Supplemental Notes (presentation info + lots more)](https://docs.google.com/document/d/18_StcjSLnmYl4K_PxBGu5dw_zC4J1PQgS29ib7-jHVo/edit?usp=sharing)
