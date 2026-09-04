```sql
CREATE TABLE nouns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    singular VARCHAR(100) NOT NULL,            -- e.g., "Hund" (without article)
    gender ENUM('masculine', 'feminine', 'neuter', 'plural_only') NOT NULL,
    plural VARCHAR(100) DEFAULT NULL,          -- e.g., "Hunde" (NULL if no plural)
    genitive_singular VARCHAR(100) DEFAULT NULL, -- e.g., "Hundes"
    is_n_deklination BOOLEAN NOT NULL DEFAULT FALSE, -- Weak nouns (e.g., "Junge", "Student")

    -- Translations & Context
    translation_en VARCHAR(255) NOT NULL,      -- Primary English translation
    example_sentence_de TEXT DEFAULT NULL,     -- e.g., "Der Hund bellt im Garten."
    example_sentence_en TEXT DEFAULT NULL,     -- e.g., "The dog barks in the garden."

    -- Metadata
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL DEFAULT 'A1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for performance
    INDEX idx_singular (singular),
    INDEX idx_gender (gender),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE           -- e.g., "Animals", "Food", "Work"
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Many-to-Many Relationship Table
CREATE TABLE noun_categories (
    noun_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (noun_id, category_id),
    CONSTRAINT fk_noun_cat_noun FOREIGN KEY (noun_id) REFERENCES nouns(id) ON DELETE CASCADE,
    CONSTRAINT fk_noun_cat_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




INSERT INTO categories (name) VALUES
('Animals'),
('Furniture'),
('Objects'),
('People'),
('Abstract');




INSERT INTO nouns
    (singular, gender, plural, genitive_singular, is_n_deklination, translation_en, example_sentence_de, example_sentence_en, level)
VALUES
    (
        'Hund',
        'masculine',
        'Hunde',
        'Hundes',
        FALSE,
        'dog',
        'Der Hund bellt laut im Garten.',
        'The dog barks loudly in the garden.',
        'A1'
    ),
    (
        'Student',
        'masculine',
        'Studenten',
        'Studenten',
        TRUE, -- N-Deklination (weak noun)
        'student (male)',
        'Ich kenne einen klugen Studenten.',
        'I know a smart student.',
        'A1'
    ),
    (
        'Katze',
        'feminine',
        'Katzen',
        'Katze',
        FALSE,
        'cat',
        'Die Katze schläft gemütlich auf dem Sofa.',
        'The cat is sleeping comfortably on the sofa.',
        'A1'
    ),
    (
        'Buch',
        'neuter',
        'Bücher',
        'Buches',
        FALSE,
        'book',
        'Hast du dieses interessante Buch gelesen?',
        'Have you read this interesting book?',
        'A1'
    ),
    (
        'Möglichkeit',
        'feminine',
        'Möglichkeiten',
        'Möglichkeit',
        FALSE,
        'possibility / opportunity',
        'Wir haben viele verschiedene Möglichkeiten.',
        'We have many different possibilities.',
        'B1'
    ),
    (
        'Eltern',
        'plural_only',
        NULL,
        NULL,
        FALSE,
        'parents',
        'Meine Eltern wohnen seit zehn Jahren in Berlin.',
        'My parents have been living in Berlin for ten years.',
        'A1'
    );



INSERT INTO noun_categories (noun_id, category_id) VALUES
    (1, 1), -- Hund -> Animals
    (2, 4), -- Student -> People
    (3, 1), -- Katze -> Animals
    (4, 3), -- Buch -> Objects
    (5, 5), -- Möglichkeit -> Abstract
    (6, 4); -- Eltern -> People
```
