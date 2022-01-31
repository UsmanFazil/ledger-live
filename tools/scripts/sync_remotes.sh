#!/bin/bash
set -e
set -x

remotes="ledger-live-desktop ledger-live-mobile ledger-live-common ledgerjs ui"
github_org=LedgerHQ
push_changes=$PUSH_CHANGES

function print {
  echo -e "\033[1m$1\033[0;0m"
}

git remote

for remote in $remotes; do
  print "> Syncing with $remote"

  remote_exists=`git remote | grep "^$remote$" || echo ''`
  if [ -z "$remote_exists" ]; then
    print "  > Adding $remote as a remote"
    git remote add "$remote" https://github.com/$github_org/$remote.git
  fi
  git fetch -n "$remote"

  git checkout main
  git reset --hard origin/main
  git clean -f -d -q
  if git rev-parse -q --verify "$remote/master"; then
    git merge --no-edit -s subtree "$remote/master"
  else
    git merge --no-edit -s subtree "$remote/main"
  fi

  git checkout develop
  git reset --hard origin/develop
  git clean -f -d -q
  if git rev-parse -q --verify "$remote/develop"; then
    git merge --no-edit -s subtree "$remote/develop"
  fi
done

print "> Merging the main branch into develop"

git checkout develop
git reset --hard origin/develop
git clean -f -d -q
git merge --no-edit main

if [ -z "$push_changes" ]; then
  print "> Rebasing the monorepo branch on top of develop"

  git checkout monorepo-setup
  git pull --ff-only
  git clean -f -d -q
  git rebase -X theirs develop
else
  print "> Pushing changes…"

  git push --atomic origin main develop
fi

echo -e "\033[1;32m\
✅ All Done!\
\033[0;0m"
