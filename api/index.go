package handler

import (
	"net/http"
	"os"

	hello_world "github.com/amsatrio/fiber-vue-crud-demo/app/modules/hello_world"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/adaptor"
	"github.com/gofiber/fiber/v3/middleware/static"
)

// for vercel
func Handler(w http.ResponseWriter, r *http.Request) {
	r.RequestURI = r.URL.String()

	handler().ServeHTTP(w, r)
}

func handler() http.HandlerFunc {
	app := fiber.New()
	routes(app)
	return adaptor.FiberApp(app)
}

func routes(app *fiber.App) {
	app.Get("/*", static.New("../public"))

	api := app.Group("/v1")
	hello_world.Router(api)

	api.Get("/config", func(ctx fiber.Ctx) error {
		return ctx.JSON(fiber.Map{
			"SERVER_PORT": os.Getenv("SERVER_PORT"),
		})
	})
}
