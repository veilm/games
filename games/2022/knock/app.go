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

func get_lines(filename string) []string {
	file, err := ioutil.ReadFile("static/jokes.txt")
	handle(err)

	return strings.Split(string(file), "\n")
}

var jokes = get_lines("static/jokes.txt")
var num_jokes = len(jokes) - 1

func main() {
	server := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", server))

	http.HandleFunc("/", joke_handler)

	log.Fatal(http.ListenAndServe(":8000", nil))
}
