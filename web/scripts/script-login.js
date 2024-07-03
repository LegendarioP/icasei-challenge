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

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM LOADED")
const buttonFormLogin = document.querySelector(".button-submit")

buttonFormLogin.addEventListener("click", function(event){
    event.preventDefault()
    var email = document.querySelector(".form-login #email").value
    var pass = document.querySelector(".form-login #password").value
    login(email,pass)
})

})