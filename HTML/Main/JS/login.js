var sign = () => {
  window.location.assign("../Main/Register.html")
}
const  Username = document.getElementById("Username")
const Password = document.getElementById("Password")
const  Message =document.getElementById ("message")

const login = ()=>{
    if (Username.value===""){
        Message.innerHTML ="Username is required"
        Message.style.color= "red"

    }else if (Password.value===""){
        Message.innerHTML ="Password is required"
        Message.style.color= "red"
} else {
    const userData = {
        Username: Username.value,
        Password: Password.value,
    }
    firebase.auth().signInWithEmailAndPassword(userData.Email, userData.Password)
  .then((userCredential) => {
    Message.innerHTML = "Sign in Sucessfully"
    Message.style.color = "green"
    if (userCredential.user.emailVerfied){
        window.location.assign("../Main/Homepage.html")
    
    }
   
    
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });

}
}