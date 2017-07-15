#!/bin/sh
#56cbc76b3e3b542d745ab6e3b865f3d01e3db4c9

set GH_TOKEN="56cbc76b3e3b542d745ab6e3b865f3d01e3db4c9"

if [ -z "$GH_TOKEN" ]; then
    echo "You must set the GH_TOKEN environment variable."
    echo "See README.md for more details."
    exit 1
fi

# This will build, package and upload the app to GitHub.
build --win -p always
