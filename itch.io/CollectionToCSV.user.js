// ==UserScript==
// @name         Itch Collection CSV Exporter
// @namespace    https://github.com/abraxas86/tampermonkey-scripts/blob/main/itch.io/
// @version      1.2
// @description  Scroll down to the bottom of your collection, click the button, get CSV of your collection!
// @author       Abraxas86
// @match        https://itch.io/c/*
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/src/FileSaver.js
// @grant        none
// @icon         https://itch.io//static/images/itchio-square-144.png
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements saveAs */

(function() {
    'use strict';
    const raw = [];
    const games = [];
    var output = "title\n";

     waitForKeyElements (".game_link", makeRed);


    $('.footer').prepend('<span class="csvButton">Export to CSV</span><p></p>');
    $('.csvButton').css({'color':'white','background-color':'grey','border-radius':'10px','padding':'15px','cursor':'pointer'});


    function makeRed(){
    $('.game_link').css("color","red");
    }

    $('.csvButton').click(function(){
        //these elements will mess up our data for the csv.
        $('.price_value').remove();
        $('.gif_label').remove();

        //scrape the game names from the code
        $('.game_link').each(function(){raw.push($(this).text())})
        // Clean up array.  Raw contains some empty strings that we don't need.
        for (var i =0; i < raw.length; i++)
        { if (raw[i] != "") { games.push(raw[i]) } }
        // Format array for CSV output, sanitizing for titles with commas,
        // and adding a newline at the end of each title
        for (i = 0; i < games.length; i++)
        { output = output + "\"" + games[i] + "\"\n" }

        var filename = "collection.csv";

        var blob = new Blob([output], {
            type: "text/plain;charset=utf-8"
        });

        saveAs(blob, filename);
    });

})();
