#!/bin/bash
heroku ps:scale web=0
git add --all
git commit -m "greeting"
git push heroku master

heroku ps:scale web=1
