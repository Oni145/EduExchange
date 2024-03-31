
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
        setTimeout (() => {
            window.location.assign ("../Main/home.html")
        },1000)
    } else {
        setTimeout(() =>{
            window.location.assign("../Main/emailverification.html")

        })
    }  
  } else {
    setTimeout(() => {
    window.location.assign("../Main/Login.html")
    },1000)
    
  }
});