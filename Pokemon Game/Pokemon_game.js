/*
 
This is the pokedex.js file.
It represents the functionality for 
the pokedex.html file. We can
play a game of pokemon.
*/
 
"use strict";
(function() {
  const URL = "https://webster.cs.washington.edu/pokedex/";
  let gameID; 
  let playerID;
  let initialHPPlayer = 0; 
  let initialHPOpponent = 0;
  const FOUND_ORIGINAL = ["Bulbasaur", "Charmander", "Squirtle"];
 
  window.onload = function() {  
    fetchAllSprites();
    $("endgame").onclick = switchBack;
    $("flee-btn").onclick = function() {
    clickButton("flee");};
  };
 
   /**
    * fetches all the sprite images 
    * from the pokedex API.
    */
   function fetchAllSprites() {
      let url = URL + "pokedex.php?pokedex=all";
      fetch(url, {mode: "cors"})
         .then(checkStatus)
         .then(populate)
         .catch(console.log);
   }

   /**
    * populates all 150 of the sprite images
    */
   function populate(response) {
      let line = response.split("\n"); 
      for(let i = 0; i < line.length; i++) {
         let imageAndPath = line[i].split(":");
         let image = imageAndPath[0];
         let path = imageAndPath[1];
         let sprite = document.createElement("img");
         sprite.classList.add("sprite");
         sprite.src = URL + "sprites/" + path;
         sprite.id = image;
         for(let i = 0; i < foundOriginal.length; i++) {
         if(sprite.id === foundOriginal[i]) {
              sprite.classList.add("found");
          } 
         }
         $("pokedex-view").appendChild(sprite);
         let found = selectAll(".found");
         for(let i = 0; i < found.length; i++) {
            found[i].onclick = fetchPokemonData;
        }
      }
   }

   /**
    * checks the status for the response
    * returned by the AJAX call, and this is
    * passed as a parameter to this function.
    * returns either the text of the response
    * or a promise.
    */
   function checkStatus(response) {
      if(response.status >= 200 && response.status < 300) {
         return response.text();
      } else {
         return Promise.reject(new Error(response.status + 
        ": " + response.statusText));
      }
   }

   /**
    * fetches the pokemon information 
    * from the Get Pokemon Data API
    */
   function fetchPokemonData() {
      let name = this.id;
      let url = 
            URL + "pokedex.php?pokemon=" + 
          name;
      fetch(url, {mode: "cors"})
         .then(checkStatus)
         .then(JSON.parse)
        .then(pokemonInformation)
        .catch(console.log);
   }

   /**
    * function to populate the card.
    * takes the response from the appropriate
    * AJAX call and the card ID ("#my-card" or "#their-card")
    */
  function populateCard(response, myCardOrTheirCard) {
    select(myCardOrTheirCard + " .name").innerText =
      response["name"]; 
    select(myCardOrTheirCard + " .pokepic").src =
      URL + response["images"]["photo"];
    select(myCardOrTheirCard + " .type").src = 
      URL + response["images"]["typeIcon"];
    select(myCardOrTheirCard + " .weakness").src = 
      URL + response["images"]["weaknessIcon"];
    select(myCardOrTheirCard + " .hp").innerText = 
      response["hp"] + "HP";
    select(myCardOrTheirCard + " .info").innerText =
      response["info"]["description"];
    let moves = response["moves"]; 
    let buttons = selectAll(myCardOrTheirCard + " .moves button"); 
    let moveName = selectAll(myCardOrTheirCard + " .moves .move"); 
    let images = selectAll(myCardOrTheirCard + " .moves img");
    let dpSpan = selectAll(myCardOrTheirCard + " .moves .dp");
    for(let i = 0; i < moves.length; i++) {
      if(buttons[i].classList.contains("hidden")) {
      buttons[i].classList.remove("hidden");
      } 
      dpSpan[i].innerText = "";
      buttons[i].disabled = false;
      moveName[i].innerText = moves[i]["name"];
      images[i].src =  URL + "icons/" +
      moves[i]["type"] + ".jpg";
      let dp = moves[i]["dp"];
      if(dp) { 
        dpSpan[i].innerText = dp + " DP";
      }
    }
    for(let i = moves.length; i < 4; i++) {
      buttons[i].classList.add("hidden"); 
    }
  }

  /**
   * populates the pokemon card when it's clicked on.
   * switches to game view
   */
  function pokemonInformation(response) {
    initialHPPlayer = response["hp"];
    populateCard(response, "#my-card");
    $("start-btn").classList.remove("hidden");
    $("start-btn").onclick = chooseThisPokemon;
  } 

  /**
   * gets the state of the game using the 
   * gameID & Player ID.
   */
  function gameState(response) { 
    initialHPOpponent = response["p2"]["hp"];
    gameID = response["guid"];
    playerID = response["pid"];
    select("#their-card .buffs").classList.remove("hidden");
    select("#my-card .buffs").classList.remove("hidden");  
    populateCard(response["p2"], "#their-card");
    let userButtons = selectAll("#my-card .moves button");
    for(let i = 0; i < userButtons.length; i++) {
      userButtons[i].onclick = function() {
      let move = this.querySelector(".move").innerText;
      let moveParameter = move.replace(" ", "").toLowerCase();
      clickButton(moveParameter);};
    }
  }

  /**
   * this is the function when a pokemon
   * is selected. It initializes the game
   * and sets the appropriate properties.
   */
  function chooseThisPokemon() {
    initializeGame();
    select(".hp-info").classList.remove("hidden"); 
    $("pokedex-view").classList.add("hidden"); 
    $("their-card").classList.remove("hidden"); 
    $("results-container").classList.remove("hidden"); 
    $("flee-btn").classList.remove("hidden"); 
    $("flee-btn").disabled = false;
    let moveButtons = document.querySelectorAll("#my-card button");
    let moveButtonsVisible = [];
    for(let i = 0; i < moveButtons.length; i++) {
      if(!(moveButtons[i].classList.contains("hidden"))) { 
         moveButtonsVisible.push(moveButtons[i]);
      }
    }
    for(let j = 0; j < moveButtonsVisible.length; j++) {
      moveButtonsVisible[j].disabled = false;
    }
    $("title").innerText = "Pokemon Battle Mode!";
    $("start-btn").classList.add("hidden");
  }

  /** 
   * function to initialize the game.
   * does the post request with AJAX 
   * to the provided URL.
   */
  function initializeGame(){
    let url = URL + "game.php";
    let data =  new FormData();
    data.append("startgame", true);
    data.append("mypokemon",
    document.querySelector("#my-card .name").innerText);
    fetch(url, {method: "POST",
    body: data, mode: 'cors'})
     .then(checkStatus)
     .then(JSON.parse)
     .then(gameState) 
     .catch(console.log);
  }

  /**
   * function that takes string as
   * parameter which represents the 
   *ID. returns document.getElementByID
   */
   function $(id) {
    return document.getElementById(id);
  }

  /**
   * function that takes string as
   * parameter which represents the
   * selector. returns document.querySelector
   */
  function select(selector) {
    return document.querySelector(selector);
  }

  /**
   * function that takes string as 
   * parameter which represents the
   * selector. Returns document.querySelectorAll.
   */
  function selectAll(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * functionality for when a move is clicked
   * or the flee button is clicked
   * takes a string parameter of the move
   * does an AJAX post request on the provided
   * URL.
   */
  function clickButton(move) {
   $("loading").classList.remove("hidden");
   let url = URL + "game.php";
    let data =  new FormData();
    data.append("movename", move);
    data.append("guid", gameID); 
    data.append("pid", playerID);
       fetch(url, {method: "POST", 
          body: data, mode: 'cors'})
       .then(checkStatus)
       .then(JSON.parse)
       .then(moveData) 
       .catch(console.log);
  } 

  /**
   * displays the results of each move
   * takes response returned by the AJAX post call
   * as the parameter.
  */
  function displayResults(response) {
    $("p1-turn-results").classList.remove("hidden");
    $("p2-turn-results").classList.remove("hidden");
    let player1Results = select("#p1-turn-results");
    let player2Results = select("#p2-turn-results");
    player1Results.innerText = "Player 1 played " + 
      response["results"]["p1-move"] +
       " and " + response["results"]["p1-result"] + "!";
    player2Results.innerText = "Player 2 played " + 
      response["results"]["p2-move"] + 
      " and " + response["results"]["p2-result"] + "!";
    if((response["results"]["p2-move"] === null) || 
        (response["results"]["p2-result"] === null)) {
       player2Results.classList.add("hidden");
    } 
  }

  /**
   * adds the functionality of the health-bar
   * takes response returned by the ajax post call
   * as the parameter
   */
  function healthBar(response) {
    let currentHPPlayer = response["p1"]["current-hp"];
    let currentHPOpponent = response["p2"]["current-hp"];
    select("#my-card .hp").innerText = 
      currentHPPlayer + "HP";
    select("#their-card .hp").innerText = 
      currentHPOpponent + "HP";
    let player1Width = 
      currentHPPlayer / response["p1"]["hp"];
    select("#my-card .health-bar").style.width =
       player1Width * 100 + "%";
    lowHealth("#my-card .health-bar", player1Width * 100);
    let player2Width = currentHPOpponent / response["p2"]["hp"];
    select("#their-card .health-bar").style.width = 
      player2Width * 100 + "%";
    lowHealth("#their-card .health-bar", player2Width * 100);
  }

  /**
   * checks whether the player is low-health
   * and does the appropriate functionality.
   * takes selector string and the percent of the health
   * bar as the parameter
   */
  function lowHealth(selector, percentHP) {
    if(percentHP <= 20) {
      select(selector).classList.add("low-health");
    } else {
      select(selector).classList.remove("low-health");
    }
  }

  /**
   * adds the functionality for the game view
   * such as healthbar, results, buffs etc.
   * takes response returned by AJAX post call.
   */
  function moveData(response) {
    $("loading").classList.add("hidden");
    displayResults(response);
    healthBar(response);
    select("#my-card .buffs").innerHTML = "";
    select("#their-card .buffs").innerHTML = "";
    addBuffsAndDebuffs(response["p1"]["buffs"],
       "buff","#my-card .buffs");
    addBuffsAndDebuffs(response["p1"]["debuffs"], 
        "debuff", "#my-card .buffs");
    addBuffsAndDebuffs(response["p2"]["buffs"], 
        "buff", "#their-card .buffs");
    addBuffsAndDebuffs(response["p2"]["debuffs"],
       "debuff", "#their-card .buffs");
    winOrLose(response); 
  }

  /**
   * the functionality that occurs when a player
   * wins or loses. Takes response returned by
   * post AJAX call as parameter.
   */
  function winOrLose(response) {
    if((response["p1"]["current-hp"] === 0) || 
      (response["p2"]["current-hp"] === 0)) {
      let buttons = selectAll("#my-card .moves button");
      for(let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
      $("endgame").classList.remove("hidden");
      if(response["p1"]["current-hp"] === 0) {
        $("title").innerText = "You lost!";
      } else {
        $(response["p2"]["name"]).classList.add("found"); 
        $(response["p2"]["name"]).onclick = fetchPokemonData;
        $("title").innerText = "You won!";
     }
    } 
  }

  /**
   * adds the buffs and debuffs
   * takes parameter of all the buffs or debuffs (array),
   * a string for whether it's a buff or debuff, and the
   * selector for where it needs to be appended to.
   */
  function addBuffsAndDebuffs(allBuffs, buffOrDebuff, bar) {
    for(let i = 0; i < allBuffs.length; i++) {
    let buff = document.createElement("div");
    buff.classList.add(buffOrDebuff);
    buff.classList.add(allBuffs[i]);
    select(bar).append(buff);
    }
  }

  /**
   * switches back to original pokedex view
   * sets the original properties
   */
  function switchBack() {
    $("endgame").classList.add("hidden");
    $("results-container").classList.add("hidden");
    $("their-card").classList.add("hidden");
    $("pokedex-view").classList.remove("hidden");
    select("#my-card .health-bar").classList.remove("low-health"); 
    select("#my-card .hp-info").classList.add("hidden");
    $("title").innerText = "Your Pokedex";
    select("#my-card .hp").innerText = initialHPPlayer + "HP";
    select("#their-card .hp").innerText = initialHPOpponent + "HP";
    select("#my-card .health-bar").style.width = "100%";
    select("#their-card .health-bar").style.width = "100%";
    select("#their-card .health-bar").classList.remove("low-health");
    $("start-btn").classList.add("hidden");
    $("flee-btn").classList.add("hidden");
    select("#my-card .buffs").innerHTML = "";
    select("#their-card .buffs").innerHTML = "";
  }
})();
   