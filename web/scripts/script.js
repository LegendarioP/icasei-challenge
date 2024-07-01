HTMLData = function(thumbnail, title) {
    return(`
        <li class="card-video">
            <div class="thumbnail-img">
                <div class="svg-play">
                    <svg xmlns="http://www.w3.org/2000/svg" height="62" viewBox="0 -960 960 960" width="62" fill="#000000"><path d="m383-310 267-170-267-170v340Zm97 230q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>
                </div>
                <img src="${thumbnail}" alt="${title}" title="${title}">
            </div>
            <div class="favorite">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000">
                    <path d="m352-293 128-76 129 76-34-144 111-95-147-13-59-137-59 137-147 13 112 95-34 144ZM243-144l63-266L96-589l276-24 108-251 108 252 276 23-210 179 63 266-237-141-237 141Zm237-333Z"/>
                </svg>
            </div>
        </li>`
    )
}



async function homePage (element){
    try {
        await axios.get('http://localhost:3333/home')
         .then(response => {
            console.log(response.data)
            const vids = response.data.items
            const loadedVids = vids.map(item => {
                const getURL = item.id
                const titleVid = item.snippet.title
                const thumbnail = item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url
                return HTMLData(thumbnail, titleVid)
            }).join('')

            element.innerHTML = loadedVids;
         })
    } catch (error) {
        element.innerHTML = '<h2>OPS, ocorreu um erro ao fazer a busca....</h2>'
        console.error(error)
    } finally {
        element.classList.remove("loading")
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('O DOM está pronto!');
    const bodyVids = document.querySelector(".videos-body ul");
    const buttonForm = document.querySelector(".search-button")
    const inputSearch = document.querySelector(".search-bar")

    homePage(bodyVids)

    async function searchVids (params){
        bodyVids.classList.add("loading")
        try {
            await axios.post('http://localhost:3333/search', {
                searchParams: params
            })
             .then(response => {
                const vids = response.data.items
                // console.log(vids)
                if(!vids.length) throw { message: 'Nenhum vídeo encontrado', code: 404 };
                const loadingVids = vids.map(item => {
                    const getURL = item.id
                    const titleVid = item.snippet.title
                    const thumbnail = item.snippet.thumbnails.maxres ? item.snippet.thumbnails.maxres.url : item.snippet.thumbnails.high.url
                    return HTMLData(thumbnail, titleVid)
                }).join('')
    
                bodyVids.innerHTML = loadingVids;
             })
        } catch (error) {
            
            if(error.code == 404) return bodyVids.innerHTML = `<h2>${error.message}</h2>`

            bodyVids.innerHTML = '<h2>OPS, ocorreu um erro ao fazer a busca....</h2>'
            console.error(error)
        } finally {
            bodyVids.classList.remove("loading")
        }
    }
    
    buttonForm.addEventListener("click", function(event) {
        event.preventDefault();
        if(inputSearch.value == '') return 
        const searchParms = encodeURI(inputSearch.value)
        searchVids(searchParms)
    
    });



    // const elemento = document.querySelector('.videos-body');
    // let scrollActive = false
    // elemento.addEventListener('scroll', function() {
    //     const scrollTop = elemento.scrollTop;
    //     const elementHeight = elemento.scrollHeight;
    //     const viewableHeight = elemento.clientHeight;

    //     const scrollPercentage = (scrollTop + viewableHeight) / elementHeight;

    //     if (scrollPercentage >= 0.9) {
    //         if(!scrollActive){
    //             scrollActive = true
    //             console.log('Você rolou 90% do elemento!');
    //         }
    //     }
    //         else {
    //             scrollActive = false
    //         }
    // });
});