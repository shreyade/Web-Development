/*global fetch */
"use strict";
(function(){

    window.onload = function(){
        fetchData();
        $("back").onclick = homeButton;
    };
    
    /**
     * Fetches book data from specified URL
     */
    function fetchData(){
        let url = "bestreads.php?mode=books";
        fetch(url, {credentials: "include"}) 
            .then(checkStatus)
            .then(JSON.parse)
            .then(displayBooks)
            .catch(error);
    }
    
    /**
     * Function that occurs when the home button 
     * is clicked
     */
    function homeButton() {
        $("singlebook").classList.add("hidden");
        $("allbooks").classList.remove("hidden");
        fetchData();
    }
    
    /**
     * Function that replaces
     * document.getElementByID();
     *  @param {String} id - the ID of the element
     */
    function $(id) {
        return document.getElementById(id);
    }
    
    /**
     * Function that does
     * error handling in the fetch calls
     */
    function error() { 
        $("error-message").classList.remove("hidden");
        $("error-message").innerHTML = "Error!!! "; 
    }
    
    /**
     * Function that displays
     * all the books
     *  @param {JSON} response - the parsed json returned by fetch call
     */
    function displayBooks(response) {
        let allBooks = response["books"];
        $("singlebook").classList.add("hidden");
        for(let i = 0; i < allBooks.length; i++) {
            let coverAndTitle = document.createElement("div");
            let title = document.createElement("p");
            let image = document.createElement("img");
            image.src = "books/" + allBooks[i]["folder"] + "/cover.jpg";
            title.innerText = allBooks[i]["title"];
            coverAndTitle.appendChild(title);
            coverAndTitle.appendChild(image);
            coverAndTitle.id = allBooks[i]["folder"];
            $("allbooks").appendChild(coverAndTitle);
            coverAndTitle.onclick = emptyOut;
        }
    }
    
    /**
     * Function that occurs when
     * the book picture or title is clicked
     *  makes fetch calls for the reviews,
     * info and description.
     */
    function emptyOut() {
        $("allbooks").innerHTML = ""; 
        $("singlebook").classList.remove("hidden");
        $("cover").src = "books/" + this.id + "/cover.jpg";
        let urlReview = "bestreads.php?mode=reviews&title=" + this.id;
        fetchInfoAndReview(urlReview,displayBookReviews);
        let urlInfo =  "bestreads.php?mode=info&title=" + this.id;
        fetchInfoAndReview(urlInfo, displayBookInfo); 
        descriptionFetch(this.id);
    }
    
    /**
     * Function that does all the fetch calls for info, reviews
     * and description
     * @param {String} id - the id of the book clicked on
     */
    function descriptionFetch(id) {
        let url = "bestreads.php?mode=description&title=" + id;
        fetch(url, {credentials: 'include'}) 
            .then(checkStatus)
            .then(function(response) {
                $("description").innerHTML = response;
            })
            .catch(error);
    }
    
    /**
     * Function that does all the fetch calls for info and
     * reviews
     * @param {String} url - the url to the fetch call too
     * @param {function} passedFunction - the url to the fetch call too
     */
    function fetchInfoAndReview(url, passedFunction) {
        fetch(url, {credentials: 'include'}) 
            .then(checkStatus)
            .then(JSON.parse)
            .then(passedFunction)
            .catch(error);
    }
    
    /**
     * Function that displays book reviews.
     * @param {JSON} response - the parsed JSON returned
     * by fetch call
     */
    function displayBookReviews(response) {
        $("reviews").innerHTML = "";
        for(let i = 0; i < response.length; i++) {
            let scoreSpan = document.createElement("span");
            scoreSpan.innerHTML = response[i]["score"];
            let reviewTitle = document.createElement("h3");
            reviewTitle.innerHTML = response[i]["name"] + " ";
            reviewTitle.appendChild(scoreSpan);
            let text = document.createElement("p");
            text.innerHTML = response[i]["text"];
            $("reviews").appendChild(reviewTitle);
            $("reviews").appendChild(text);
        }
    }
    /**
     * Function that displays book info.
     * @param {JSON} response - the parsed JSON returned
     * by fetch call
     */
    function displayBookInfo(response) {
        $("title").innerHTML = response["title"];
        $("author").innerHTML = response["author"];
        $("stars").innerHTML = response["stars"];
    }
    
     /**
     * Function that checks status of fetch called.
     * @param {JSON} response - the parsed JSON returned
     * by fetch call
     */
    function checkStatus(response) {
        let responseText = response.text();
        if (response.status >= 200 && response.status < 300) {
            return responseText;
        } else {
            return responseText.then(Promise.reject.bind(Promise));
        }
    }
})();