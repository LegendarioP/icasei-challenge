async function login(emailData,passData){
    try {
        const response = await axios.post("http://localhost:3333/login", {
            email: emailData,
            password: passData
        })
        const token = response.data.token
        Cookies.set('token', token, { path: '/', expires: 7 },);
        window.location.href = '/'
    } catch (error) {
        console.error(error)
    }
}

async function register(name, emailData, passData){
    try {
        const response = await axios.post("http://localhost:3333/register", {
            name,
            email: emailData,
            password: passData
        })
        const token = response.data.token
        Cookies.set('token', token, { path: '/', expires: 7 },);
        window.location.href = '/'
    } catch (error) {
        console.error(error)
    }
}




document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM LOADED")
    const buttonFormLogin = document.querySelector(".form-login .button-submit")
    const buttonFormRegister = document.querySelector(".form-register .button-submit")

    buttonFormLogin.addEventListener("click", function(event){
        event.preventDefault()
        var email = document.querySelector(".form-login #email-login").value
        var pass = document.querySelector(".form-login #password-login").value
        login(email,pass)
    })

    buttonFormRegister.addEventListener("click", function(event){
        event.preventDefault()
        var name = document.querySelector(".form-register #name-register").value
        var email = document.querySelector(".form-register #email-register").value
        var pass = document.querySelector(".form-register #password-register").value
        register(name, email, pass)
    })

    const toggleForms = document.querySelectorAll(".toggle-register b")
    toggleForms.forEach(function (toggleButton) {
        toggleButton.addEventListener("click", function(event){
            event.preventDefault()
            // console.log("hi")

            const firstForm = event.currentTarget.closest("form").classList
            const targetForm = event.currentTarget.closest(".toggle-register").dataset.formtarget
            // console.log(targetForm)
            if(!firstForm.contains("hidden")){
                firstForm.add("hidden")
                let secondForm = event.currentTarget.closest(".center-login").querySelector(`.${targetForm}`).classList
                if(secondForm.contains("hidden")){
                    secondForm.remove("hidden")
                }
            }
        })
    })

})