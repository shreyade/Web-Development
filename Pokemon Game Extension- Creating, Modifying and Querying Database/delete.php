<?php
    /* 
    Deletes from the Pokedex table and takes a parameter of the name of either the pokemon
    to remove or mode=removeall
    */
    error_reporting(E_ALL);
    include("common.php");
    $db = pdoSetup();
    if(isset($_POST["mode"])) {
        $mode = strtolower($_POST["mode"]);
        if($mode == "removeall") {
            try {
                $db-> exec ("DELETE FROM Pokedex;");
                headers(true);
                print(json_encode(Array("success"=> "Success! All Pokemon removed" .
                "from your Pokedex!")));
            } 
            catch (PDOException $ex) {
                print ("Can not connect to the database. Please try again later.\n");
                print ("Error details: $ex \n");
                die();
            }
        } else {
            header("HTTP/1.1 400 Error");
            headers(false);
            print(Array("error"=> "Error: Unknown mode {$mode}."));
            die();
        }
    } elseif(isset($_POST["name"])) { 
        $name = ($_POST["name"]);
        removeSpecificName($name, $db);
    } else {
        noParameterProvided("name", "mode");
    }
    
    // takes parameter of the name to be removed
    // and $db which is the pdo object
    // checks if the name exists in the Pokedex table,
    // and if it is, deletes it from the table.
    function removeSpecificName($name, $db) {
        pokemonFound($db, $name, false);
        deleteFrom($name);
        headers(true);
        print(json_encode(Array("success"=> "Success! {$name} removed from your Pokedex!")));
    }
?>