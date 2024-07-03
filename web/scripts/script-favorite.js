var myFavorites
var nextToken = '';
HTMLData = function(idVid, thumbnail, title, isFav) {
    return(`
        <li class="card-video loading-configs">
            <div class="thumbnail-img" data-id="${idVid}">
                <div class="svg-play">
                    <svg xmlns="http://www.w3.org/2000/svg" height="62" viewBox="0 -960 960 960" width="62" fill="#000000"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>
                </div>
                <img src="${thumbnail}" alt="${title}" title="${title}">
            </div>
            <div class="favorite ${isFav ? 'active' : ''}">
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#e8eaed">
                    <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
                </svg>
            </div>
        </li>`
    )
}



function updateFavoriteValues(value){
    const favoritesLength = document.querySelector("#favorites .favorite-number")
    return favoritesLength.innerHTML = value
}
function removeLoadingClass() {
    const loadingItens = document.querySelectorAll(".loading-configs")
    loadingItens.forEach(function(loadingItem){
        return loadingItem.classList.remove("loading-configs")
    })
}

async function favoriteVideo(idVid, favoritedItem, token) {
    try {
        await axios.post("http://localhost:3333/favorites", {
            youtube_idVid: `${idVid}`,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            // console.log(response.data)
            // console.log(favoritedItem)
            myFavorites.push(response.data)
            favoritedItem.classList.add("active")
            updateFavoriteValues(myFavorites.length)
        })
    } catch (error) {
        console.error(error)
    }
}

async function removeFavoritedVideo(idVid, favoritedItem, token) {
    const item = myFavorites.find(item => item.youtube_idVid == idVid)
    // console.log(myFavorites)
    try {
        await axios.delete(`http://localhost:3333/favorites/${item.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        myFavorites = myFavorites.filter(item => item.youtube_idVid !== idVid);
        favoritedItem.classList.remove("active")
        updateFavoriteValues(myFavorites.length)
    } catch (error) {
        console.error(error)
    }
}

function favoriteButton(token) {
    const favoriteButton = document.querySelectorAll(".favorite")
    favoriteButton.forEach(function(button) {
        button.addEventListener("click", function(event) {
            const id_video = event.target.closest(".card-video").querySelector(".thumbnail-img").dataset.id
            const favoritedItem = event.currentTarget
            if(!event.currentTarget.classList.contains("active")){
                favoriteVideo(id_video, favoritedItem, token)
            }
            else {
                removeFavoritedVideo(id_video, favoritedItem, token)    
            }
        });
    });
}

async function homePage (element, token){

    if(token){
        try {
            await axios.get("http://localhost:3333/favorites",{
                headers: {
                   'Authorization': `Bearer ${token}`,
                }
           }).then(response => {
                myFavorites = response.data
                updateFavoriteValues(myFavorites.length)
           })
           console.log(myFavorites)
           
        } catch (error) {
            console.error(error)
        }
    }

    
    try {
        await axios.get('http://localhost:3333/favoritedVideos',{
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
         .then(response => {
            console.log(response.data)
            const vids = response.data.items
            const loadedVids = vids.map(item => {
                const getURL = item.id
                const hasFavorited = myFavorites.find(item => item.youtube_idVid == getURL) ? true : false
                // console.log(hasFavorited)
                // console.log(getURL)
                const titleVid = item.snippet.title
                const thumbnail = item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url
                return HTMLData(getURL, thumbnail, titleVid, hasFavorited)
            }).join('')

            element.innerHTML = loadedVids;
            removeLoadingClass()
            favoriteButton(token)
         })
    } catch (error) {
        element.innerHTML = '<h2>OPS, ocorreu um erro ao buscar os videos favoritados, tente novamente em alguns minutos....</h2>'
        console.error(error)
    } finally {
        element.classList.remove("loading")
    }
}
async function loadNextVideos(element, token){
    // console.log(nextToken)
    if(nextToken != ''){
        try {
            await axios.post('http://localhost:3333/loadvideos', {
                pageToken: nextToken
            })
            .then(response => {
                console.log(response.data)
                const vids = response.data.items
                const loadedVids = vids.map(item => {
                    const getURL = item.id
                    const hasFavorited = myFavorites.find(item => item.youtube_idVid == getURL) ? true : false
                    const titleVid = item.snippet.title
                    const thumbnail = item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url
                    return HTMLData(getURL, thumbnail, titleVid, hasFavorited)
                }).join('')
                element.insertAdjacentHTML("beforeend", loadedVids);
                favoriteButton(token)
                removeLoadingClass()
                nextToken = response.data.nextPageToken ? response.data.nextPageToken : ''
            })
        } catch (error) {
            element.innerHTML = '<h2>OPS, ocorreu um erro ao fazer a busca....</h2>'
            console.error(error)
        } finally {
            element.classList.remove("loading")
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('O DOM está pronto!');
    const bodyVids = document.querySelector(".videos-body ul");
    let token = Cookies.get("token")

    homePage(bodyVids, token)

    



    // favoriteButton.addEventListener("click", function(event) {
    //     event.preventDefault()

    //     console.log("oi")
    // })


    const elemento = document.querySelector('.videos-body');
    let scrollActive = false
    elemento.addEventListener('scroll', function() {
        const scrollTop = elemento.scrollTop;
        const elementHeight = elemento.scrollHeight;
        const viewableHeight = elemento.clientHeight;

        const scrollPercentage = (scrollTop + viewableHeight) / elementHeight;

        if (scrollPercentage >= 0.9) {
            if(!scrollActive){
                scrollActive = true
                loadNextVideos(bodyVids, token)
            }
        }
        else {
            scrollActive = false
        }
    });
});