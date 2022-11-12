
//put duration to 2 decimals everytime
//make it so that after you filter you dont have to resort

/* url of song api --- https versions hopefully a little later this semester */
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';



/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
document.addEventListener("DOMContentLoaded", function () {
   let songCollection = JSON.parse(localStorage.getItem('songs')) || [];
   let playList = [];
   retrieveSongs(songCollection);
   generateBrowseView(songCollection);


   //SORTING CLICK EVENTS
   //-----------------------------------------------------------------------------
   //click event for sorting Title
   document.querySelector('#sortTitle').addEventListener('click', function () {
      songCollection = sortMethod(songCollection, 'title');
      displaySongs(songCollection);
   });

   //click event for sorting Artist
   document.querySelector('#sortArtist').addEventListener('click', function () {
      songCollection = sortMethod(songCollection, 'artist', 'name');
      displaySongs(songCollection);
   });

   //click event for sorting Year
   document.querySelector('#sortYear').addEventListener('click', function () {
      songCollection = sortMethod(songCollection, 'year');
      displaySongs(songCollection);
   });

   //click event for sorting Genre
   document.querySelector('#sortGenre').addEventListener('click', function () {
      songCollection = sortMethod(songCollection, 'genre', 'name');
      displaySongs(songCollection);
   });

   //click event for sorting Popularity
   document.querySelector('#sortPopularity').addEventListener('click', function () {
      songCollection = sortMethod(songCollection, 'details', 'popularity');
      displaySongs(songCollection);
   });

   //Filter event depending on filter options
   document.querySelector("#btnFilter").addEventListener('click', function () {
      if (document.querySelector("#first").checked) {
         songCollection = JSON.parse(localStorage.getItem('songs')) || [];
         retrieveSongs(songCollection);
         songCollection = filterTitle(songCollection);
         displaySongs(songCollection);
      }
      else if (document.querySelector("#second").checked) {
         songCollection = JSON.parse(localStorage.getItem('songs')) || [];
         retrieveSongs(songCollection);
         songCollection = filterArtist(songCollection);
         displaySongs(songCollection);
      }
      else if (document.querySelector("#third").checked) {
         songCollection = JSON.parse(localStorage.getItem('songs')) || [];
         retrieveSongs(songCollection);
         songCollection = filterGenre(songCollection);
         displaySongs(songCollection);
      }
   });

   document.querySelector("#btnClear").addEventListener('click', function () {
      songCollection = JSON.parse(localStorage.getItem('songs')) || [];
      retrieveSongs(songCollection);
      displaySongs(songCollection);
   });



   document.querySelector("#tableSongs tbody").addEventListener('click', function (e) {
      if (e.target && e.target.nodeName.toLowerCase() == 'a') {
         let song = songCollection.find(item => item.song_id == e.target.dataset.id);
         // const searchView = document.querySelector()
         document.querySelector("#browserView").removeAttribute("class");
         document.querySelector("#browserView").setAttribute("class", "hidden");
         document.querySelector("#songView").removeAttribute("class");
         document.querySelector("#songView").setAttribute("class", "visible");
         generateSongView(song);

      }
   });


   document.querySelector("#variableButton").addEventListener('click', function () {
      const button = document.querySelector("#variableButton");
      songCollection = JSON.parse(localStorage.getItem('songs')) || [];
      retrieveSongs(songCollection);

      if (button.class == "#songView")
         document.querySelector("#browserView").removeAttribute("class");
      document.querySelector("#browserView").setAttribute("class", "visible");
      document.querySelector("#songView").removeAttribute("class");
      document.querySelector("#songView").setAttribute("class", "hidden");
      returning = generateBrowseView(songCollection);
});

});


//SongCollection Retrieval Methods
//-----------------------------------------------------------------------------
async function retrieveSongs(songCollection) {
   //if songCollection is not in local storage then fetch from api
   if (songCollection.length == 0) {
      songCollection = await getSongs();
      //save to local storage
      localStorage.setItem('songs', JSON.stringify(songCollection));
   }
   songCollection = sortMethod(songCollection, 'title');
}

async function getSongs() {
   const response = await fetch(api);
   console.log('after first await');    //REMOVE THIS LATER
   const data = await response.json();
   return data;
}

//display the songs as table to the webpage
function displaySongs(songCollection) {
   //empty display before populating new display
   document.querySelector("tbody").innerHTML = "";

   const tableSong = document.querySelector("#tableSongs tbody");
   for (let song of songCollection) {
      //create rows and insert data
      const tr = document.createElement("tr");
      const tdTitle = document.createElement("td");
      const titleLink = document.createElement("a");

      titleLink.setAttribute("id", `${song.song_id}`);
      titleLink.textContent = song.title;

      titleLink.dataset.id = song.song_id;

      const tdArtist = document.createElement("td");
      tdArtist.textContent = song.artist.name;
      const tdYear = document.createElement("td");
      tdYear.textContent = song.year;
      const tdGenre = document.createElement("td");
      tdGenre.textContent = song.genre.name;
      const tdPopularity = document.createElement("td");
      tdPopularity.textContent = song.details.popularity;

      const addBtn = document.createElement("button");
      addBtn.setAttribute("song-id", song.song_id);
      addBtn.textContent = "Add";

      //append them
      tdTitle.appendChild(titleLink);
      tr.appendChild(tdTitle);
      tr.appendChild(tdArtist);
      tr.appendChild(tdYear);
      tr.appendChild(tdGenre);
      tr.appendChild(tdPopularity);
      tr.appendChild(addBtn);
      tableSong.appendChild(tr);
   }
}



//Function to populate Song Search Dropdown
function populateSearch() {
   const artists = JSON.parse(contentArtist);
   const genres = JSON.parse(contentGenre);
   const selArtist = document.querySelector("#artistDrop");
   const selGenre = document.querySelector("#genreDrop");

   //create a dropdown item for each artist
   for (let artist of artists) {
      const opt = document.createElement("option");
      opt.setAttribute("value", artist.name);
      opt.textContent = artist.name;
      selArtist.appendChild(opt);
   }
   //create a dropdown item for each genre
   for (let genre of genres) {
      const opt = document.createElement("option");
      opt.setAttribute("value", genre.name);
      opt.textContent = genre.name;
      selGenre.appendChild(opt);
   }
}

//The sorting method depending on what youare sorting
function sortMethod(songCollection, topic, topic2) {
   songCollection.sort((a, b) => {
      //if topic two topics or one topic
      if (topic2) {
         return a[topic][topic2].toString().toUpperCase() < b[topic][topic2].toString().toUpperCase() ? -1 : 1;
      }
      else {
         return a[topic].toString().toUpperCase() < b[topic].toString().toUpperCase() ? -1 : 1;
      }
   });
   return songCollection;
}


//function from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
function filterTitle(songCollection) {
   let subString = document.querySelector("#titleForm").value;
   return songCollection.filter(a => a.title.toString().toLowerCase().includes(subString.toLowerCase()));
}

function filterArtist(songCollection) {
   let artistWanted = document.querySelector("#artistDrop").value
   return songCollection.filter(a => a.artist.name.toString().toLowerCase().includes(artistWanted.toLowerCase()));
}

function filterGenre(songCollection) {
   let genreWanted = document.querySelector("#genreDrop").value
   return songCollection.filter(a => a.genre.name.toString().toLowerCase().includes(genreWanted.toLowerCase()));
}

function generateBrowseView(songCollection) {
   // let songCollection = JSON.parse(localStorage.getItem('songs')) || [];
   //set title to default filter setting
   const radioSetup = document.querySelector("#first");

   const button = document.querySelector("#variableButton");
   button.innerHTML = ""
   button.textContent = "Playlist";
   button.setAttribute("class", "browseView");
   button.removeAttribute("class");

   radioSetup.setAttribute("checked", 1);

   // retrieveSongs(songCollection);
   displaySongs(songCollection);
   populateSearch();
}

//Start of song view functions
//-----------------------------------------------------------------------------
function generateSongView(song) {
   displaySongInformation(song);
   displaySongAnalysis(song);
   makeChart(song);

   //change header button
   const button = document.querySelector("#variableButton");
   button.textContent = "Close View";
   button.removeAttribute("class");
   button.setAttribute("class", "songView");

   returning = 1;
   return returning;
}

function displaySongInformation(song) {
   const dataList = document.querySelector("#songWriteUp");
   const artists = JSON.parse(contentArtist);

   artistObj = artists.find(element => element.id == song.artist.id);
   artistType = artistObj.type

   duration = getDuration(song.details.duration);
   dataList.textContent = `Title: ${song.title}, Artist: ${song.artist.name}, Artist Type: ${artistType}, Genre:${song.genre.name}, Release Year: ${song.year}, Duration: ${duration}`;

}

function displaySongAnalysis(song) {
   const analysisData = document.querySelector("#dataList");
   analysisData.innerHTML = "";

   const bpm = document.createElement("li");
   bpm.textContent = `BPM: ${song.details.bpm}`;
   analysisData.appendChild(bpm);

   const energy = document.createElement("li");
   energy.textContent = `Energy: ${song.analytics.energy}`;
   analysisData.appendChild(energy);

   const danceability = document.createElement("li");
   danceability.textContent = `Danceability: ${song.analytics.danceability}`;
   analysisData.appendChild(danceability);

   const liveness = document.createElement("li");
   liveness.textContent = `Liveness: ${song.analytics.liveness}`;
   analysisData.appendChild(liveness);

   const valence = document.createElement("li");
   valence.textContent = `Valence ${song.analytics.valence}`;
   analysisData.appendChild(valence);

   const acousticness = document.createElement("li");
   acousticness.textContent = `Acousticness: ${song.analytics.acousticness}`;
   analysisData.appendChild(acousticness);

   const speechiness = document.createElement("li");
   speechiness.textContent = `Speechiness: ${song.analytics.speechiness}`;
   analysisData.appendChild(speechiness);

   const popularity = document.createElement("li");
   popularity.textContent = `Popularity: ${song.details.popularity}`;
   analysisData.appendChild(popularity);
}

function getDuration(duration) {
   let minutes = duration / 60;
   minutes = Math.floor(minutes);
   const seconds = duration % 60;
   const formatedDuration = `${minutes}:${seconds}`;
   return formatedDuration;
}

//Create the radar chart depending on the song passed in
//taken from https://www.chartjs.org/docs/latest/getting-started/
function makeChart(song) {
   const labels = [
      'energy',
      'danceability',
      'liveness',
      'valence',
      'acousticness',
      'speechiness',
   ];

   const data = {
      labels: labels,
      datasets: [{
         label: song.title,
         backgroundColor: 'rgba(44, 130, 201, 0.4)',
         borderColor: 'rgba(44, 130, 201,0.8)',
         data: [song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness],
      }]
   };

   const config = {
      type: 'radar',
      data: data,
      options: {
         elements: {
            line: {
               borderWidth: 3
            }
         }
      },
   };

   //If a chart already exist then destroy it before creating a new one
   //taken from https://stackoverflow.com/questions/40056555/destroy-chart-js-bar-graph-to-redraw-other-graph-in-same-canvas
   let myChart = Chart.getChart("myChart");
   if (myChart != undefined) {
      myChart.destroy();
   }
   myChart = new Chart(document.querySelector('#myChart'), config);
}