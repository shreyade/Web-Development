 /*global fetch */
 "use strict";
(function(){

    window.onload = function(){
       document.getElementById("click").onclick = insert;
       document.getElementById("deleteClick").onclick = deletePHP; 
       document.getElementById("tradeClick").onclick =  tradePHP;
       document.getElementById("updateClick").onclick = updatePHP;
    };
    
   function insert(){
        let url = "insert.php";// put url string here
        let data =  new FormData();
        data.append("name", "randomm");
        data.append("nickname", "rando");
        fetch(url, {method: "POST", body: data, credentials: "include"}) // include credentials for cloud9
           .then(checkStatus)
          // .then(JSON.parse)
           .then(function(response) {
               document.getElementById("rand").innerHTML = response;
            })
    } 
    
    function deletePHP() {
        let url = "delete.php";
        let data =  new FormData();
        data.append("name", "RaNdOmm");
        fetch(url, {method: "POST", body: data, credentials: "include"}) // include credentials for cloud9
           .then(checkStatus)
           //.then(JSON.parse)
           .then(function(response) {
               document.getElementById("rand2").innerHTML = response;
            })
    }
    
   function tradePHP() {
        let url = "trade.php";
        let data =  new FormData();
        data.append("mypokemon", "randomm");
        data.append("theirpokemon", "cool4");
        fetch(url, {method: "POST", body: data, credentials: "include"}) // include credentials for cloud9
           .then(checkStatus)
           //.then(JSON.parse)
           .then(function(response) {
               document.getElementById("rand3").innerHTML = response;
            })
    }
    
    function updatePHP() {
        let url = "update.php";
        let data =  new FormData();
        data.append("name", "ranDomm");
        data.append("nickname", "shreya");
       // data.append("name", "WOO");
        //data.append("nickname", "yo");
        //data.append("nickname", "hello");
        fetch(url, {method: "POST", body: data, credentials: "include"}) // include credentials for cloud9
           .then(checkStatus)
           //.then(JSON.parse)
           .then(function(response) {
               document.getElementById("rand4").innerHTML = response;
            })
    } 
    
    function checkStatus(response) {
        let responseText = response.text();
        if (response.status >= 200 && response.status < 300) {
            return responseText;
        } else {
            return responseText.then(Promise.reject.bind(Promise));
        }
    }
    
    
    
})();