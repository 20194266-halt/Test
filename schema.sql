CREATE DATABASE test;
USE test;

CREATE TABLE `brand` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    PRIMARY KEY (`id`));

CREATE TABLE `model` (
     `id` INT NOT NULL AUTO_INCREMENT,
     `name` VARCHAR(200) NOT NULL,
     `brand_id` INT NOT NULL,
     PRIMARY KEY (`id`)
     FOREIGN KEY (`brand_id`) REFERENCES `brand`(`id`)
);

CREATE TABLE `watch` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `serial_number` VARCHAR(200) NOT NULL,
    `year_of_manufacture` INT NOT NULL,
    `Water-resistant` VARCHAR(20) NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `size` VARCHAR(20) NOT NULL,
    `left_over` INT NOT NULL,
    `customer_reviews` FLOAT NOT NULL,
    `model_id` INT NOT NULL,
    CHECK (`customer_reviews`>=1 AND `customer_reviews`<=5)
    PRIMARY KEY (`id`),
    FOREIGN KEY (`model_id`) REFERENCES `model`(`id`)
);




