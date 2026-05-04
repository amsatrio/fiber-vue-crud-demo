package helloworld

import (
	"github.com/amsatrio/fiber-vue-crud-demo/app/dto/response"
	"github.com/gofiber/fiber/v3"
)

func HelloWorld(c fiber.Ctx) error {
	res := &response.Response{}
	res.Ok(c.Path(), "hello world!")

	return c.Status(res.Status).JSON(res)
}
