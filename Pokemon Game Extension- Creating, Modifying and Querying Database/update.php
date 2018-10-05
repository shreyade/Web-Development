<?php
     /* 
    Takes a value of a pokemon to rename or
    an optional nickname. Either the pokemon is found
    and the nickname is renamed with the passed parameter
    nickname, or the pokemon is found and the nickname
    is renamed with the upper case of the passed name.
    */
    error_reporting(E_ALL);
    include("common.php");
    $db = pdoSetup();
    if(!isset($_POST["nickname"]) && !isset($_POST["nickname"])) {
        noParameterProvided("name", "nickname"); 
    }
    $name = $_POST["name"];
    if(isset($_POST["nickname"])) {
        $nickname = $_POST["nickname"];
    } else {
        $nickname = strtoupper($name);
    }
    try {
        $nameColumn = $db-> query("SELECT name FROM Pokedex");
    }
    catch(PDOException $ex) {
        headers(true);
        print ("Can not connect to the database.\n");
        print ("Error details: $ex \n");
        die();
    }
    $inPokedex = false;
    pokemonFound($db, $name, false);
    if($inPokedex) { 
        header("HTTP/1.1 400 Error");
        headers(true);
        print(json_encode(Array("error"=> "Error: Pokemon {$name} not " .
            "found in your Pokedex.")));
        die();
    } else {
        try {
            $sql = "UPDATE Pokedex SET nickname = :nickname WHERE name = :name;";
        }
        catch(PDOException $ex) {
            headers(false);
            print ("Can not connect to the database.\n");
            print ("Error details: $ex \n");
            die();
        }
        $stmt = $db->prepare($sql);
        $params = array("nickname" => $nickname, "name" => $name);
        $stmt->execute($params);
        headers(true);
        print(json_encode(Array("success"=> "Success! Your {$name} is now " + 
            "named {$nickname}")));
    }
?>