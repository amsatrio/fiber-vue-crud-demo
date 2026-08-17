package cmd

import (
	"bufio"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/amsatrio/fiber-vue-crud-demo/app/dto/response"
	"github.com/amsatrio/fiber-vue-crud-demo/app/modules/health"
	hello_world "github.com/amsatrio/fiber-vue-crud-demo/app/modules/hello_world"
	"github.com/amsatrio/fiber-vue-crud-demo/app/modules/hospital"
	_ "github.com/amsatrio/fiber-vue-crud-demo/docs"
	"github.com/gofiber/contrib/v3/swaggo"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
	"github.com/gofiber/template/html/v3"
)

func Config() fiber.Config {
	engine := html.NewFileSystem(http.Dir("./html"), ".html")
	return fiber.Config{
		CaseSensitive: true,
		StrictRouting: true,
		BodyLimit:     4 * 1024 * 1024,
		// DisableStartupMessage: true,
		ServerHeader: "Fiber Vue CRUD Demo",
		AppName:      "Fiber Vue CRUD Demo v0.0.1",
		JSONEncoder:  json.Marshal,
		JSONDecoder:  json.Unmarshal,
		ErrorHandler: func(c fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError

			var e *fiber.Error
			if errors.As(err, &e) {
				code = e.Code
			}

			res := &response.Response{}
			res.ErrMessage(c.Path(), code, err.Error())

			return c.Status(code).JSON(res)
		},
		Views: engine,
	}
}

func Routes(app *fiber.App) {
	app.Get("/swagger/*", swaggo.HandlerDefault)

	api := app.Group("/v1")
	hello_world.Router(api)
	health.Router(api)
	hospital.Router(app)

	api.Get("/config", func(ctx fiber.Ctx) error {
		return ctx.JSON(fiber.Map{
			"SERVER_PORT": os.Getenv("SERVER_PORT"),
		})
	})

	app.Get("/html", func(c fiber.Ctx) error {
		// Render index - start with views directory
		return c.Render("index", fiber.Map{
			"Title": "Hello, World!",
		})
	})
	app.Get("/html/layout", func(c fiber.Ctx) error {
		// Render index within layouts/main
		return c.Render("index", fiber.Map{
			"Title": "Hello, World!",
		}, "layouts/main")
	})
	app.Get("/html/modules/coffee", func(c fiber.Ctx) error {
		return c.Render("index", fiber.Map{
			"Title": "Hello, World!",
		}, "modules/coffee/index")
	})
	app.Get("/html/modules/portfolio", func(c fiber.Ctx) error {
		return c.Render("index", fiber.Map{
			"Title": "Hello, World!",
		}, "modules/portfolio/index")
	})
	app.Get("/html/modules/company_portfolio", func(c fiber.Ctx) error {
		return c.Render("index", fiber.Map{
			"Title": "Hello, World!",
		}, "modules/company_portfolio/index")
	})
	app.Get("/html/modules/wedding", func(c fiber.Ctx) error {
		return c.Render("index", fiber.Map{
			"Title": "Hello, World!",
		}, "modules/wedding/index")
	})

	// Static assets
	app.Get("/*", static.New("./public"))

	// SPA fallback  -  catches everything else
	app.Get("*", static.New("./public/index.html"))
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
