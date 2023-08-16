const parent = document.querySelector(".parent");
const signup_link = document.querySelector(".signup-link");
const login_link = document.querySelector(".login-link");

signup_link.onclick = () => {
    parent.classList.add("active");
    document.title = "Sign up"
};
login_link.onclick = () => {
    parent.classList.remove("active");
    document.title = "Log in"

};

// login Function 
document.querySelector('#login_form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.querySelector('#login_email').value;
        const password = document.querySelector('#login_password').value;

        try {
            const resp = await axios.post('/api/v1/login', {
                email: email,
                password: password
            });
            console.log("Respond: ", resp.status)
            if(resp.status === 200){
                alert("Login Successfully");
                window.location.href = '/page/index.html'
            }
        } catch(e) {
            alert("Invalid Email or Password");
            console.log(e);
        }
    })

// Sign up Function
document.querySelector('#signup_form')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.querySelector('#signup_email').value;
        const password = document.querySelector('#signup_password').value;
        const username = document.querySelector('#signup_username').value;

        try {
            const resp = await axios.post('/api/v1/signup', {
                username: username,
                email: email,
                password: password
            });
            console.log("Respond: ", resp.status)
            if(resp.status === 200){
                alert("Login Successfully");
                window.location.href = '/page/index.html'
            }
        } catch(e) {
            alert("Invalid Email or Password");
            console.log(e);
        }
    })