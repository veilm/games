package main

import (
	"net/http"
	"math/rand"
)

func joke_handler(w http.ResponseWriter, r *http.Request) {
	joke := jokes[rand.Intn(num_jokes)]

	err := templates.ExecuteTemplate(w, "index.html", joke)
	handle(err)
}
