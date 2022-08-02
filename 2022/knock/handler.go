package main

import (
	"net/http"
	"math/rand"
)

func jokeHandler(w http.ResponseWriter, r *http.Request) {
	joke := jokes[rand.Intn(numJokes)]

	err := templates.ExecuteTemplate(w, "index.html", joke)
	handle(err)
}
