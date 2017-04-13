DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS locations;


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL
);

CREATE TABLE routes (
    route_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id)
);

CREATE TABLE locations (
	location_id SERIAL PRIMARY KEY,
	name VARCHAR NOT NULL,
	geolocation VARCHAR NOT NULL
);

CREATE TABLE route_location (
  route_id    int REFERENCES routes (route_id) ON UPDATE CASCADE ON DELETE CASCADE,
  location_id int REFERENCES locations (location_id) ON UPDATE CASCADE,
  CONSTRAINT route_location_pkey PRIMARY KEY (route_id, location_id)  -- explicit pk
);