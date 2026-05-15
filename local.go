package main

import (
	"log"
	"os"

	"github.com/amsatrio/fiber-vue-crud-demo/app/initializer"
	"github.com/amsatrio/fiber-vue-crud-demo/app/middleware"
	"github.com/amsatrio/fiber-vue-crud-demo/app/util"
	"github.com/amsatrio/fiber-vue-crud-demo/cmd"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func init() {
	initializer.LoadEnvironmentVariables()
	initializer.LoggerInit()
	initializer.InitializeDatabase()
}

func main() {
	// runtime.GOMAXPROCS(1)

	app := fiber.New(cmd.Config())

	// ### Middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"}, // v3 expects a slice of strings for origins
		AllowHeaders: []string{"*"},
	}))
	// app.Use(cache.New())
	app.Use(recover.New())
	app.Use(middleware.LoggerMiddleware)

	cmd.Routes(app)

	port := os.Getenv("SERVER_PORT")
	host := os.Getenv("SERVER_HOST")
	util.Log("INFO", "root", "main", "listen and serve on "+host+" port "+port)

	// ### Run
	log.Fatal(app.Listen(host + ":" + port))
}
