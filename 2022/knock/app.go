package main

import (
	"html/template"
	"net/http"
	"strings"
	"log"
	"fmt"
	"os"
	"io/ioutil"
)

var templates = template.Must(template.ParseFiles("index.html"))

func handle(err error) {
	if err != nil {
		fmt.Println(os.Stderr, err)
		os.Exit(1)
	}
}

func getLines(filename string) []string {
	file, err := ioutil.ReadFile("static/jokes.txt")
	handle(err)

	return strings.Split(string(file), "\n")
}

var jokes = getLines("static/jokes.txt")
var numJokes = len(jokes) - 1

func main() {
	server := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", server))

	http.HandleFunc("/", jokeHandler)

	log.Fatal(http.ListenAndServe(":8000", nil))
}
