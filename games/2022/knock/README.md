# Knock Knock

This app requires a server to be running so I cannot have a live version on
GitHub Pages.

## Running
```sh
git clone --depth 1 https://github.com/michaelskyba/michaelskyba.github.io
mv michaelskyba.github.io/games/2022/knock .
rm -rf michaelskyba.github.io

cd knock
go run . & $BROWSER localhost:8000
```
