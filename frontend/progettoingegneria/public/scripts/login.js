let hide_btn = document.querySelector(".hide");

hide_btn.addEventListener("click", function() {
    this.classList.toggle('clicked');

    let passwordInput = document.querySelector('input[placeholder="Your password"]');
    if(passwordInput.getAttribute('type') == 'password'){
        passwordInput.setAttribute('type','text');
    }else{
        passwordInput.setAttribute('type','password');
    }
});