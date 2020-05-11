#!/bin/bash

# get current commit hash for tag
commit=$(git rev-parse HEAD)

# get repo name from git
remote=$(git config --get remote.origin.url)
repo=$(basename $remote .git)

# get version from package.json file
VERSION=$(jq -r '.version' package.json)
# create new tag
new=v$VERSION
# show new tag
echo $new

# POST a new ref to repo via Github API
curl -s -X POST https://api.github.com/repos/$REPO_OWNER/$repo/git/refs \
-H "Authorization: token $GITHUB_TOKEN" \
-d @- << EOF
{
  "ref": "refs/tags/$new",
  "sha": "$commit"
}
EOF