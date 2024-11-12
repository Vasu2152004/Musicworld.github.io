

console.log("let's start js...");
let currentsong = new Audio();
let songs;
let currfolder;
function convertToMinutesSeconds(seconds) {
    // Calculate the minutes and remaining seconds
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Ensure only two digits for seconds

    // Format the seconds to always show two digits (e.g., "05" instead of "5")
    const formattedSeconds = secs < 10 ? '0' + secs : secs;

    // Return the result as "minutes:seconds"
    return `${mins}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder=folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    // console.log("Response:", response);

    // Use a regex to find all URLs ending with .mp3 in the HTML response
    let regex = /href="([^"]+\.mp3)"/g;
    let matches;
     songs = [];

    while ((matches = regex.exec(response)) !== null) {
        // Extract the matched .mp3 URL
        let m4aUrl = matches[1];
        // Convert relative URLs to absolute URLs
        if (!m4aUrl.startsWith("http")) {
            m4aUrl = new URL(m4aUrl, `http://127.0.0.1:5500/${folder}/`).href;
        }
        songs.push(m4aUrl.split(`/${currfolder}/`)[1]);
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
                            <img class="invert" src="assets/music-notes-svgrepo-com.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," " ).replace("%26","&").replaceAll("%2C",",")}</div>
                                <div>Vasu</div>
                            </div>
                           
        
         </li>`;
        
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;
}

const playmusic = (track)=>{
    //let audio = new Audio("/songs/"+track)
    currentsong.src=`/${currfolder}/`+track
    currentsong.play()
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00.00/00.00"
}

async function main() {

    await getsongs("songs");
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            //play.src="assets/pause-cicle-svgrepo-com.svg"
        }
        else{
            currentsong.pause()
           //play.src="assets/play-cicle-svgrepo-com.svg"
        }
    })

    currentsong.addEventListener("timeupdate",()=>{
        // console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${convertToMinutesSeconds(currentsong.currentTime)}/${convertToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let pr = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=pr+"%";
        currentsong.currentTime = ((currentsong.duration)*pr)/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })
    document.querySelector(".hamburger").addEventListener("touchstart", ()=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("touchstart",()=>{
        document.querySelector(".left").style.left="-120%";
    })
    //load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            // songlistul.innerHTML=""
            await getsongs(`songs/${item.currentTarget.dataset.folder}`);
          //  playmusic(songs[0])
        })
    })
    next.addEventListener("click",()=>{
        // console.log(currentsong.src.split("/").slice(-1) [0])
        let index = songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if([index+1]>length){
            playmusic(songs[index+1])
        }
    })
   
}

main();
