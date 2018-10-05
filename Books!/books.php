<?php
    error_reporting(E_ALL);
    
    // checks if the appropriate query parameters are passed
    // which is mode and title for the description, info
    // and reviews, and just the mode for the books.
    // If the appropriate query parameters are not passed, 
    // errors are thrown. 
    if(!(isset($_GET["mode"]))) {
        header("HTTP/1.1 400 Error");
        header("Content-Type: text/plain");
        die("Please provide a mode of description, info, reviews, or books.");  
    } else if(!isset($_GET["title"]) && $_GET["mode"] != "books") {
        header("HTTP/1.1 400 Error");
        header("Content-Type: text/plain");
        die("Error: Please remember to add the title parameter when" . 
            "using a mode of description, info or reviews.");
    } else {
        $mode = strtolower($_GET["mode"]);
        if ($mode == "books") {
            $files = glob("books/*");
            books($files); 
        }  elseif(isset($_GET["title"])) {
            $book = $_GET["title"];
            if($mode == "info") {
                $file = file("books/{$book}/info.txt");
                info($file); 
            } elseif($mode == "reviews") {
                $files = glob("books/{$book}/review*.txt");
                reviews($files,$book);
            }  elseif($mode == "description") {
                description($book);
            }
        }
    }
    
    // outputs the description of the book in plain text format.
    // takes the title of the book as the 
    // parameter. 
    function description($book){
        header("Content-Type: text/plain");
        $file = file_get_contents("books/".$book."/description.txt");
        print $file;
    }
    
    // outputs the information about the book in JSON format.
    // takes a file path as parameter.
    function info($file) {
        header("Content-Type: application/json");
        $infoData = array(  
        "title" => trim($file[0]),
        "author" => trim($file[1]),
        "stars" => trim($file[2]),
        );
        print(json_encode($infoData, JSON_PRETTY_PRINT));
    }
    
    // outputs the reviews about the book in JSON format.
    // takes an array of file paths and the title of
    // the book as parameters./
    function reviews($files,$book) {
        header("Content-Type: application/json");
        $allReviews = [];
        foreach($files as $reviews) {
            $review = explode("/",$reviews)[2];
            $eachfile = "books/$book/$review";
            $fileContents = file($eachfile);
            $eachReviewArray = array (
            "name" => trim($fileContents[0]),
            "score" => trim($fileContents[1]),
            "text" => trim($fileContents[2])
            );
            array_push($allReviews,$eachReviewArray);
        }
        print(json_encode($allReviews, JSON_PRETTY_PRINT));
    }
    
    // Outputs all information about a particular book
    // in JSON format. 
    function books($files) {
        header("Content-Type: application/json");
        $allBooks = array("books" => []);
        foreach($files as $books) {
            $fileContents = explode("/", $books);
            $title = $fileContents[1];
            $eachFile = explode("\n",file_get_contents("books/$title/info.txt")); 
            $eachBookArray = array (
            "title" => trim($eachFile[0]),
            "folder" =>  trim($title)
            );
            array_push($allBooks["books"], $eachBookArray);
        }
        print(json_encode($allBooks, JSON_PRETTY_PRINT));
    }
?>