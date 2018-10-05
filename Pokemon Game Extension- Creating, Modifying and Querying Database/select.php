<?php
    /* 
    Outputs JSON response of all pokemon in pokedex table.
    The pokedex table values are the found pokemon
    */
    include("common.php");
    error_reporting(E_ALL);
    $db =  pdoSetup();
    try {
        $info = $db->query("SELECT * FROM Pokedex;");
    }
    catch(PDOException $ex){
        headers(true);
        print ("Can not connect to the database.\n");
        print ("Error details: $ex \n");
        die();
    }
    headers(true);
    $output = array("pokemon" => []);
    foreach($info as $row) {
        $eachPokemon = array (
        "name" => $row["name"],
        "nickname" =>  $row["nickname"],
        "datefound" => $row["datefound"]
         );
        array_push($output["pokemon"], $eachPokemon);
    }
    print(json_encode($output));
?>