// ==UserScript==
// @name         Itch Collection CSV Exporter
// @namespace    https://github.com/abraxas86/tampermonkey-scripts/blob/main/itch.io/
// @version      2.5
// @description  Scroll down to the bottom of your collection, click the button, get CSV of your collection!
// @author       Abraxas86
// @match        https://itch.io/c/*
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://raw.githubusercontent.com/eligrey/FileSaver.js/master/src/FileSaver.js
// @grant        none
// @icon         https://itch.io//static/images/itchio-square-144.png
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements saveAs */

(function() {
    'use strict';
    const games  = [];
    var mode     = "null";
    var Title    = "";
    var URL      = "";
    var output   = "title,url\n";
    var filename = $('.grid_header > h2:nth-child(1)').text();

     waitForKeyElements (".game_link", makeRed);

    if (document.querySelector('.game_title a') == null || document.querySelector('.game_title a') == undefined)
    { mode = "list"; }
    else
    { mode = "grid"; }


    $('.footer').prepend('<span class="csvButton">Export to CSV</span>&nbsp;&nbsp;&nbsp;<input type="text" id="fileName" class="csvText" value=""> <span class="extension">.csv</span><p></p>');
    $('#fileName').attr("value",filename);
    $('.csvButton').css({'color':'white','background-color':'grey','border-radius':'10px','padding':'15px','cursor':'pointer'});
    $('.extension').css({'font-size':'14pt'});
    $('.csvText').css({'padding':'5px','border':'none','border-radius':'10px','font-size':'13pt','background-color':'#555555','color':'#BCBCBC','text-align':'right'});


    function makeRed(){
    $('.game_link').css("color","red");
    }

    $('.csvButton').click(function(){
        //these elements will mess up our data for the csv.
        $('.price_value').remove();
        $('.gif_label').remove();

        //scrape the game names from the code
        $('.game_title').each(function()
                              {
            //Name o
            Title = $(this).text();

            //Game URL
            if (mode == "grid")
            {
                URL = this.querySelector('a').href;
            }
            else if (mode == "list")
            {
                URL = $(this).prop('href');
            }
            else
            { console.error("Error grabbing name/url"); }
            console.log(URL + " - " + Title);
            games.push("\"" + Title +"\",\"" + URL + "\""); //sanitizing varibales to prevent commas from breaking stuff
        });

        // Format array for CSV output, sanitizing for titles with commas,
        // and adding a newline at the end of each title
        for (var i = 0; i < games.length; i++)
        { output = output + games[i] + "\n" }

        var filename = document.getElementById("fileName").value;
        if (filename == "")
        { filename = "collection"; }

        filename = filename + ".csv";

        var blob = new Blob([output], {
            type: "text/plain;charset=utf-8"
        });

        saveAs(blob, filename);
    });

})();
