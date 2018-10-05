<?php
    /* 
    Adds Pokemon to Pokedex table with required given name 
    parameter.
    */
    error_reporting(E_ALL);
    include("common.php");
    $db =  pdoSetup();
    if(!isset($_POST["name"])) {
        oneRequiredParameter("name");
    } else {
        $name = $_POST["name"];
    }
    if(isset($_POST["nickname"])) {
        $nickname = $_POST["nickname"];
    } else {
        $nickname = strtoupper($name) ;
    }
    date_default_timezone_set('America/Los_Angeles');
    $time = date('y-m-d H:i:s');
    try {
       pokemonFound($db, $name,true);
    } 
    catch(PDOException $ex) {
        print ("Can not connect to the database. Please try again later.\n");
        print ("Error details: $ex \n");
        die();
    }
    try {
        insert($db,(strtolower($name)), $nickname, $time);
    }
    catch(PDOException $ex) {
        print ("Can not connect to the database. Please try again later.\n");
        print ("Error details: $ex \n");
        die();
    }
    headers(true);
    header("Content-type: application/json"); 
    print(json_encode(Array("success"=>"Success!{$name} added to your Pokedex!")));
?>