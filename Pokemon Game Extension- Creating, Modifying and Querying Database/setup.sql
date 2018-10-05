/*
Creates a table called
Pokedex. Has a column
of name which takes a VARCHAR value,
column nickname which takes a VARCHAR value,
and datefound column which takes a DATETIME value.
the name column is the primary key of the Pokedex table.
*/

CREATE TABLE Pokedex(
    name VARCHAR(30),
    nickname VARCHAR(30),
    datefound DATETIME,
    PRIMARY KEY(name)
);