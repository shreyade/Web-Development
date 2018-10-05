<?php
    /* 
    Takes pokemon to remove from table and 
    pokemon to receive in trade as parameters.
    Replaces the pokemon to remove with the pokemon
    to receive in trade.
    */
    error_reporting(E_ALL);
    include("common.php");
    $db = pdoSetup();
    if(!isset($_POST["mypokemon"]) || !isset($_POST["theirpokemon"])) {
        missingMultipleParameters("mypokemon", "theirpokemon");  
    } else {
        $myPokemon = $_POST["mypokemon"];
        $theirPokemon = $_POST["theirpokemon"];
        try {
            pokemonFound($db, $theirPokemon,true);
        } 
        catch(PDOException $ex) {
            headers(false);
            print ("Can not connect to the database.\n");
            print ("Error details: $ex \n");
            die();
        }
        $pokemonFound = pokemonFound($db, $theirPokemon,false);
        if($pokemonFound) {
            header("HTTP/1.1 400 Error");
            headers(true);
            print(json_encode(Array("error"=> "Error: Pokemon {$myPokemon} not" .
                "found in your Pokedex."))); 
            die();
        }
        deleteFrom($myPokemon);
        date_default_timezone_set('America/Los_Angeles');
        $time = date('y-m-d H:i:s');
        insert($db, $theirPokemon, strtoupper($theirPokemon), $time);
        headers(true);
        print(json_encode(Array("success"=>"Success! You have traded your {$myPokemon} for" . 
            "their {$theirPokemon}")));
    }
?>