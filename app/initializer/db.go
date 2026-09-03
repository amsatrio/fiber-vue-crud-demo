package initializer

import (
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB
var DB_FILE_MANAGEMENT *gorm.DB

func getGormLogLevel() logger.LogLevel {
	logMode := os.Getenv("LOG_MODE")
	switch logMode {
	case "ERROR":
		return logger.Error
	case "INFO":
		return logger.Info
	default:
		return logger.Info
	}
}

func getGormWriter(filePath string) (io.Writer, *os.File) {
	if os.Getenv("LOG_TYPE") == "stdout" {
		return os.Stdout, nil
	}

	if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
		panic(err)
	}

	file, err := os.Create(filePath)
	if err != nil {
		panic(err)
	}

	return io.MultiWriter(os.Stdout, file), file
}

func newGormLogger(filePath string) (*logger.Interface, io.Closer) {
	writer, file := getGormWriter(filePath)

	l := logger.New(
		log.New(writer, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  getGormLogLevel(),
			IgnoreRecordNotFoundError: true,
			ParameterizedQueries:      true,
			Colorful:                  false,
		},
	)

	var closer io.Closer
	if file != nil {
		closer = file
	}

	return &l, closer
}

func InitializeDatabase() {
	var err error

	gormLogger, closer := newGormLogger("logs/gorm-db-hospital.log")
	if closer != nil {
		defer closer.Close()
	}

	dsn := os.Getenv("DB_URL")
	DB, err = gorm.Open(mysql.New(mysql.Config{
		DSN:                       dsn,
		DefaultStringSize:         256,
		DisableDatetimePrecision:  true,
		DontSupportRenameIndex:    true,
		DontSupportRenameColumn:   true,
		SkipInitializeWithVersion: false,
	}), &gorm.Config{
		Logger: *gormLogger,
	})
	if err != nil {
		log.Fatal("Failed to connnect to database")
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get sqlDB")
	}

	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Minute)
}

func InitializeDatabaseFileManagement() {
	var err error

	gormLogger, closer := newGormLogger("logs/gorm-db-file-management.log")
	if closer != nil {
		defer closer.Close()
	}

	dsn := os.Getenv("DB_FILE_MANAGEMENT_URL")
	DB_FILE_MANAGEMENT, err = gorm.Open(mysql.New(mysql.Config{
		DSN:                       dsn,
		DefaultStringSize:         256,
		DisableDatetimePrecision:  true,
		DontSupportRenameIndex:    true,
		DontSupportRenameColumn:   true,
		SkipInitializeWithVersion: false,
	}), &gorm.Config{
		Logger: *gormLogger,
	})
	if err != nil {
		log.Fatal("Failed to connnect to database")
	}

	sqlDB, err := DB_FILE_MANAGEMENT.DB()
	if err != nil {
		log.Fatal("Failed to get sqlDB")
	}

	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Minute)
}
