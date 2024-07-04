var myFavorites
var nextToken = '';
var searchMode = false;
var searchParams = ''

function HTMLData(idVid, thumbnail, title, isFav) {
    return(`
        <li class="card-video loading-configs">
            <div class="thumbnail-img" data-id="${idVid}">
                <div class="svg-play">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
                    </svg>
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
        if(token) {
            const id_video = event.target.closest(".modal-content").dataset.id
            const favoritedItem = event.currentTarget
            !event.currentTarget.classList.contains("active") ? favoriteVideo(id_video, favoritedItem, token) : removeFavoritedVideo(id_video, favoritedItem, token)
        }
        else {
            alert("Voce precisa estar logado!")
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
            if(token){
                const id_video = event.target.closest(".card-video").querySelector(".thumbnail-img").dataset.id
                const favoritedItem = event.currentTarget
                !event.currentTarget.classList.contains("active") ? favoriteVideo(id_video, favoritedItem, token) : removeFavoritedVideo(id_video, favoritedItem, token)    
            }
            else {
                alert("voce deve estar logado!")
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
           
        } catch (error) {
            console.error(error)
        }
    }

    
    try {
        await axios.get('http://localhost:3333/home')
         .then(response => {
            const vids = response.data.items
            const loadedVids = vids.map(item => {
                const getURL = item.id
                const hasFavorited = myFavorites ? myFavorites.find(item => item.youtube_idVid == getURL) ? true : false : false
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
    bodyVids.classList.add("loading")
    try {
        await axios.post('http://localhost:3333/search', {
            searchParams: params,
            pageToken: nextToken
        })
         .then(response => {
            const vids = response.data.items
            if(!vids.length) throw { message: 'Nenhum vídeo encontrado', code: 404 };
            const loadingVids = vids.map(item => {
                const getURL = item.id.videoId
                const titleVid = item.snippet.title
                const hasFavorited = myFavorites ? myFavorites.find(item => item.youtube_idVid == getURL) ? true : false : false
                const thumbnail = item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url
                return HTMLData(getURL,thumbnail, titleVid, hasFavorited)
            }).join('')

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
    if(nextToken != ''){
        try {
            await axios.post('http://localhost:3333/loadvideos', {
                pageToken: nextToken
            })
            .then(response => {
                const vids = response.data.items
                const loadedVids = vids.map(item => {
                    const getURL = item.id
                    const hasFavorited = myFavorites ? myFavorites.find(item => item.youtube_idVid == getURL) ? true : false : false
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
    if(nextToken != ''){
        try {
            await axios.post('http://localhost:3333/search', {
                searchParams: searchParams,
                pageToken: nextToken
            })
            .then(response => {
                const vids = response.data.items
                const loadedVids = vids.map(item => {
                    const getURL = item.id.videoId
                    const hasFavorited = myFavorites ? myFavorites.find(item => item.youtube_idVid == getURL) ? true : false : false
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
        searchMode = true
        searchVids(bodyVids, searchParams, token)
    });

    const toggleMenuButton = document.querySelector(".menu-mobile")
    const toggleMenuButtonShadow = document.querySelector(".shadow")
    const toggleMenuButtonButton = document.querySelector(".close-drawer")


    toggleMenuButton.addEventListener("click", function(event){
        event.preventDefault()
        toggleMenuButton.closest(".body-content").querySelector(".shadow").classList.add("active")
    })

    toggleMenuButtonShadow.addEventListener("click", function(event){
        event.preventDefault()
        toggleMenuButton.closest(".body-content").querySelector(".shadow").classList.remove("active")
    })
    toggleMenuButtonButton.addEventListener("click", function(event){
        event.preventDefault()
        toggleMenuButton.closest(".body-content").querySelector(".shadow").classList.remove("active")
    })

    if(token){
        const buttonLogged = document.querySelectorAll(".user-login-button")
        buttonLogged.forEach(function(button){
            button.innerHTML = 'SAIR';
            button.removeAttribute("href")
            button.classList.add("exit")
            button.addEventListener("click", function(event){
                event.preventDefault()
                if(event.currentTarget.classList.contains("exit")){
                    Cookies.remove('token')
                    window.location.href = '/'
                }
            })
        })
    }


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
            }
        }
        else {
            scrollActive = false
        }
    });



});