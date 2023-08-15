const parent = document.querySelector(".parent");
const signup_link = document.querySelector(".signup-link");
const login_link = document.querySelector(".login-link");

signup_link.onclick = () => {
    parent.classList.add("active");
};
login_link.onclick = () => {
    parent.classList.remove("active");
};


document.getElementById("login_btn").addEventListener('click', () => {
    let login_email = document.querySelector("#login_email").value;
    let login_password = document.querySelector("#login_password").value;
    console.log(login_email, login_password);
    alert(login_email);
    alert(login_password);
    axios
        .post(`/api/v1/login`, {
            email: login_email,
            password: login_password,
        })
        .then(function (response) {
            console.log(response.data);
            alert(`${response.data}`);
        })
        .catch(function (error) {
            console.log(error.data);
        });
})
