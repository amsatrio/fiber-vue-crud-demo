package main

import (
	"bufio"
	"log"
	"os"
	"strings"

	hello_world "github.com/amsatrio/fiber-vue-crud-demo/app/modules/hello_world"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
)

// for local
func main() {
	app := fiber.New()

	initEnvironment()

	routes(app)

	log.Fatal(app.Listen(":" + os.Getenv("SERVER_PORT")))
}

func initEnvironment() {
	err := LoadEnv()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func routes(app *fiber.App) {
	app.Get("/*", static.New("./public"))

	api := app.Group("/v1")

	hello_world_api := api.Group("/hello-world")
	hello_world_api.Get("", hello_world.HelloWorld)
	hello_world_api.Get("/path/:message", hello_world.HelloWorldPath)
	hello_world_api.Get("/query", hello_world.HelloWorldQuery)
	hello_world_api.Post("/payload", hello_world.HelloWorldPayload)
	hello_world_api.Get("/error/:type", hello_world.HelloWorldError)

	app.Get("/config", func(ctx fiber.Ctx) error {
		return ctx.JSON(fiber.Map{
			"SERVER_PORT": os.Getenv("SERVER_PORT"),
		})
	})
}

func LoadEnv() error {
	file, err := os.Open(".env")
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		if len(line) == 0 || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])

		// Set to System Environment so os.Getenv works
		os.Setenv(key, value)
	}

	return scanner.Err()
}
