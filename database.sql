CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE stock (
    product_id SERIAL NOT NULL,
    userid INTEGER REFERENCES users(id),
    current_dt TIMESTAMP NOT NULL,
	category VARCHAR(100) NOT NULL,
	quantity VARCHAR(10) NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	product_size VARCHAR(50) NOT NULL,
	exp_date TIMESTAMP NOT NULL,
	storage_location VARCHAR(100) NOT NULL,
	PRIMARY KEY (product_id),
	FOREIGN KEY (userid) REFERENCES users (id)
);

CREATE TABLE grocery_list (
    list_item_id SERIAL NOT NULL,
    userid INTEGER REFERENCES users(id) NOT NULL,
    product_name VARCHAR(100) NOT NULL
);
