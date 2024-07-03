var myFavorites
var nextToken = '';
var searchMode = false;
var searchParams = ''

function HTMLData(idVid, thumbnail, title, isFav) {
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


function modalHTML(titleVideo, idVideo, isFav, token){
    const htmlVideo = `
        <div class="modal-video active">
            <div class="modal-content" data-id="${idVideo}">
                <div class="modal-header">
                    <h2>${titleVideo}</h2>
                    <div class="favorite ${isFav ? "active" : ""}">
                        <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill="#d1d1d1">
                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"></path>
                        </svg>
                    </div>
            </div>
            <div class="modal-body">
                <iframe src="https://www.youtube.com/embed/${idVideo}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>
            </div>
            <div class="modal-footer">
                <button type="button" class="close-modal">FECHAR</button>
            </div>
            
        </div>
    </div>
    `
   document.body.insertAdjacentHTML("afterbegin", htmlVideo)

    const closeButton = document.querySelector(".modal-video .close-modal")
    const modalVideo = document.querySelector(".modal-video")
    const favoriteModalVideo = document.querySelector(".modal-video .favorite")

    function closeModal() {
        modalVideo.remove();
    }
    closeButton.addEventListener("click", function(event) {
        event.preventDefault();
        closeModal();
    });
    modalVideo.addEventListener("click", function(event) {
        if (event.target === modalVideo) {
            closeModal();
        }
    });

    favoriteModalVideo.addEventListener("click", function(event) {
        event.preventDefault()
        const id_video = event.target.closest(".modal-content").dataset.id
        const favoritedItem = event.currentTarget
        if(!event.currentTarget.classList.contains("active")){
            // console.log("hi")
            favoriteVideo(id_video, favoritedItem, token)
        }
        else {
            removeFavoritedVideo(id_video, favoritedItem, token)    
        }
    })
    
    
        
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

function openAndGenerateModal(token){
    const openModalVideo = document.querySelectorAll(".loading-configs .thumbnail-img")
    openModalVideo.forEach(function(modalPlay){
        modalPlay.addEventListener("click", function(event) {
            event.preventDefault()
            const getIdVid = event.currentTarget.dataset.id
            const getTitleVid = event.currentTarget.querySelector("img").getAttribute("title")
            const isFavorited = event.currentTarget.closest(".card-video").querySelector(".favorite").classList.contains("active") ? true : false
            modalHTML(getTitleVid, getIdVid, isFavorited, token)
        })

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
            
            if(document.querySelectorAll(`[data-id="${idVid}"]`).length > 1){
                document.querySelector(`.card-video [data-id="${idVid}"]`).closest(".card-video").querySelector(".favorite").classList.add("active")
                favoritedItem.classList.add("active")
            }
            else {
                favoritedItem.classList.add("active")
            }

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
        if(document.querySelectorAll(`[data-id="${idVid}"]`).length > 1){
            document.querySelector(`.card-video [data-id="${idVid}"]`).closest(".card-video").querySelector(".favorite").classList.remove("active")
            favoritedItem.classList.remove("active")
        }
        else {
            favoritedItem.classList.remove("active")
        }
        updateFavoriteValues(myFavorites.length)
    } catch (error) {
        console.error(error)
    }
}

function favoriteButton(token) {
    const favoriteButton = document.querySelectorAll(".loading-configs .favorite")
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
        await axios.get('http://localhost:3333/home')
         .then(response => {
            console.log(response.data)
            const vids = response.data.items
            // console.log(response.data)
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
            favoriteButton(token)
            openAndGenerateModal(token)
            removeLoadingClass()
            nextToken = response.data.nextPageToken
         })
    } catch (error) {
        element.innerHTML = '<h2>OPS, ocorreu um erro ao fazer a dos videos, tente novamente em instantes!</h2>'
        console.error(error)
    } finally {
        element.classList.remove("loading")
    }
}

async function searchVids (bodyVids, params, token){
    // console.log(bodyVids)
    bodyVids.classList.add("loading")
    // console.log(myFavorites)
    try {
        await axios.post('http://localhost:3333/search', {
            searchParams: params,
            pageToken: nextToken
        })
         .then(response => {
            const vids = response.data.items
            // console.log(vids)
            if(!vids.length) throw { message: 'Nenhum vídeo encontrado', code: 404 };
            const loadingVids = vids.map(item => {
                const getURL = item.id.videoId
                const titleVid = item.snippet.title
                const hasFavorited = myFavorites.find(item => item.youtube_idVid == getURL) ? true : false
                const thumbnail = item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url
                return HTMLData(getURL,thumbnail, titleVid, hasFavorited)
            }).join('')

            console.log(response.data)

            bodyVids.innerHTML = loadingVids;
            favoriteButton(token)
            openAndGenerateModal(token)
            removeLoadingClass()
            nextToken = response.data.nextPageToken
         })
    } catch (error) {
        
        if(error.code == 404) return bodyVids.innerHTML = `<h2>${error.message}</h2>`

        bodyVids.innerHTML = '<h2>OPS, ocorreu um erro ao fazer a busca....</h2>'
        console.error(error)
    } finally {
        bodyVids.classList.remove("loading")
    }
}

async function loadNextVideos(element, token){
    console.log("entrou no load",nextToken)
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
                openAndGenerateModal(token)
                removeLoadingClass()
                nextToken = response.data.nextPageToken
            })
        } catch (error) {
            element.innerHTML = '<h2>OPS, ocorreu um erro ao fazer a busca....</h2>'
            console.error(error)
        } finally {
            element.classList.remove("loading")
        }
    }
}
async function loadNextSearchVideos(element, token){
    console.log("entrou no search: ",nextToken)
    if(nextToken != ''){
        try {
            await axios.post('http://localhost:3333/search', {
                searchParams: searchParams,
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
                openAndGenerateModal(token)
                removeLoadingClass()
                nextToken = response.data.nextPageToken
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
    const buttonForm = document.querySelector(".search-button")
    const inputSearch = document.querySelector(".search-bar")
    let token = Cookies.get("token")

    homePage(bodyVids, token)


    
    buttonForm.addEventListener("click", function(event) {
        event.preventDefault();
        if(inputSearch.value == '') return 
        searchParams = inputSearch.value
        nextToken = '';
        // console.log(nextToken)
        searchMode = true
        searchVids(bodyVids, searchParams, token)
    });


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
                searchMode ? loadNextSearchVideos(bodyVids, token) : loadNextVideos(bodyVids, token)
                
                // console.log('Você rolou 90% do elemento!');
            }
        }
        else {
            scrollActive = false
        }
    });



});