<?php
    /* 
    Handles the error handling with
    the parameters and takes in any
    common code.
    */
    
    // sets up the PDO connection with SQL
    function pdoSetup() {
        $hostName =  "localhost";
        $dbname = "hw7";    
        $username = "root";    
        $password = "";     
        $datasource = "mysql:host={$hostName};dbname={$dbname};charset=utf8";
        $db = new PDO($datasource,$username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    }
    
    // takes a string parameter which is the 
    // one required parameter.This is for 
    // handling the error that if the user does
    // not provide a required parameter.
    function oneRequiredParameter($parameter) {
        header("HTTP/1.1 400 Error");
        header("Content-Type: application/json");
        print(json_encode(Array("error"=> "Missing {$parameter} parameter")));
        die();
    }
    
    // takes two string parameters. Handles the error if
    // there are two required parameters are required for the call
    // and either of them are missing.
    function missingMultipleParameters($parameter1, $parameter2) {
        header("HTTP/1.1 400 Error");
        header("Content-Type: application/json");
        print(json_encode(Array("error"=> "Missing {$parameter1} and" . 
            " {$parameter2} parameter")));
        die();
    }
    
    // takes two string parameters. Handles the error when
    // one of a number of parameters are required but
    // none are provided.
    function noParameterProvided($parameter1, $parameter2) {
        header("HTTP/1.1 400 Error");
        header("Content-Type: application/json");
        print(json_encode(Array("error"=> "Missing {$parameter1} or " .
            "{$parameter2} parameter")));
        die();
    }
    
    // takes a boolean value for whether the header
    // text needs to be in JSON format or not.
    // outputs the appropriate header.
    function headers($ifJSON) {
        if($ifJSON) {
            header("Content-Type: application/json"); 
        } else {
            header("Content-Type: text/plain"); 
        }
    }
    
    // takes a pdo object $db, string $name,
    // and boolean $error.
    // checks if the pokemon is found and depending
    // on the value passed in for error, it either
    // displays an error message or 
    // returns true.
    function pokemonFound($db, $name, $error) {
        $nameColumn = $db-> query("SELECT name FROM Pokedex;");
        foreach($nameColumn as $row) {
            if(strcasecmp($row["name"], $name) == 0) {
                if($error) {
                    header("HTTP/1.1 400 Error");
                    header("Content-Type: application/json");
                    print(json_encode(Array("error"=> "Error: Pokemon " . 
                    "{$name} already found.")));
                    die();
                } else {
                    return true;
                }
            } 
        }
    } 
    
    // takes a string parameter 
    // which is the name
    // deletes it from the Pokedex table
    function deleteFrom($parameter) {
        $db = pdoSetup();
        $sql = "DELETE FROM Pokedex WHERE UPPER(name) = :name;";
        $stmt = $db->prepare($sql);
        $params = array("name" => strtoupper($parameter));
        $stmt->execute($params); 
    }
    
    // takes a pdo object $db, string $name, 
    // string $nickname, and $time in DATETIME.
    // inserts the $name, $nickname, and $time
    // into the pokedex table.
    function insert($db, $name, $nickname, $time) {
        $sql = "INSERT INTO Pokedex (name, nickname, datefound)
            VALUES(:name, :nickname, :time);";
        $stmt = $db->prepare($sql);
        $params = array("name" => $name, "nickname" => $nickname, "time" => $time);
        $stmt->execute($params);
    }

?>
