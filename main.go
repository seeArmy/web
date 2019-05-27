package main

import (
	"gopkg.in/macaron.v1"
	"log"
	"flag"
	"net/http"
)

var (
	addr    = flag.String("addr", ":8088", "http service address")
	webroot = flag.String("webroot", "", "static root dir")
)

func main() {

	flag.Parse()

	if *webroot == "" {
		log.Fatal("webroot is blank")
	}

	initHttpServer()

	log.Printf("===================web startup ok!===================")

	// hold the main routine
	select {}
}

func initHttpServer() {

	m := macaron.New()

	m.Use(macaron.Recovery())

	m.Use(macaron.Static(*webroot, macaron.StaticOptions{
		Prefix:      "login/",
		IndexFile:   "login.html",
		SkipLogging: true,
	}))

	m.NotFound(notFound)

	serve := &http.Server{
		Addr:    *addr,
		Handler: m,
	}

	// startup http server
	go func() {
		log.Println(serve.ListenAndServe())
	}()
}

func notFound() string {
	return "Hi"
}
