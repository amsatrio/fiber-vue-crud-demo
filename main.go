package main

import (
	"bufio"
	"log"
	"os"
	"strings"

	helloworld "github.com/amsatrio/fiber-vue-crud-demo/app/modules/hello-world"
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

	api := app.Group("/api")

	hello_world_api := api.Group("/hello-world")
	hello_world_api.Get("", helloworld.HelloWorld)

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
