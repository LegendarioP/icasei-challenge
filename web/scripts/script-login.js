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
        error.response.status == 404 ? alert("usuario não encontrado") : ''
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
        error.response.status == 409 ? alert("Usuario com e-mail já cadastrado") : ''

    }
}




document.addEventListener('DOMContentLoaded', function() {
    const buttonFormLogin = document.querySelector(".form-login .button-submit")
    const buttonFormRegister = document.querySelector(".form-register .button-submit")

    buttonFormLogin.addEventListener("click", function(event){
        event.preventDefault()
        var email = document.querySelector(".form-login #email-login").value
        var pass = document.querySelector(".form-login #password-login").value

        if(email == '' || pass == '') {
            alert("Verifique os campos obrigatorios")
            return
        }
        login(email,pass)
    })

    buttonFormRegister.addEventListener("click", function(event){
        event.preventDefault()
        var name = document.querySelector(".form-register #name-register").value
        var email = document.querySelector(".form-register #email-register").value
        var pass = document.querySelector(".form-register #password-register").value
        if(name = "" || email == '' || pass == '') {
            alert("Verifique os campos obrigatorios")
            return
        }
        register(name, email, pass)
    })

    const toggleForms = document.querySelectorAll(".toggle-register b")
    toggleForms.forEach(function (toggleButton) {
        toggleButton.addEventListener("click", function(event){
            event.preventDefault()
            const firstForm = event.currentTarget.closest("form").classList
            const targetForm = event.currentTarget.closest(".toggle-register").dataset.formtarget
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