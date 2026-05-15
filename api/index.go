package api

import (
	"net/http"

	"github.com/amsatrio/fiber-vue-crud-demo/app/middleware"
	"github.com/amsatrio/fiber-vue-crud-demo/cmd"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/adaptor"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/recover"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	r.RequestURI = r.URL.String()

	handler().ServeHTTP(w, r)
}

func handler() http.HandlerFunc {
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
	return adaptor.FiberApp(app)
}
