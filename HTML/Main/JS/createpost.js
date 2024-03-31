let postValue = document.getElementById("textarea");
let progressdiv = document.getElementById("progressdiv");
let progressbar = document.getElementById("progressbar");
let done = document.getElementById("done");
let uid;
let currentUser = null;
let url = "";
let fileType = ""; 
let userimg = document.getElementById ("userimg");
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            setTimeout(() => {
                uid = user.uid;
            }, 1000);
        } else {
            setTimeout(() => {
                window.location.assign("../Main/emailverification.html");
            });
        }
    } else {
        setTimeout(() => {
            window.location.assign("../Main/Login.html");
        }, 1000);
    }
});

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
});

let uploading = (event) => {
    fileType = event.target.files[0].type;
    var uploadTask = firebase.storage().ref().child(`posts/${event.target.files[0].name}`).put(event.target.files[0]);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var uploadpercentage = Math.round(progress);
            progressdiv.style.display = "block";
            progressbar.style.width = `${uploadpercentage}%`;
            progressbar.innerHTML = `${uploadpercentage}%`;
        },
        (error) => {
            // Handle unsuccessful uploads
            console.error("Error uploading file: ", error);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                url = downloadURL;
                done.style.display = "block";
                progressdiv.style.display = "none";
            });
        }
    );
};

var d = new Date().toLocaleDateString();

function createPost() {
  
    var postValue = document.getElementById("textarea").value;

    if (postValue !== "" || url !== "") {
        firebase.firestore().collection("posts").add({
            postValue: postValue,
            uid: currentUser.uid, 
            url: url,
            fileType: fileType,
            like: "",
            dislike: "",
            comment: "",
            Date: `${d}`
        }).then((res) => {
            firebase.firestore().collection("posts").doc(res.id).update({
                id: res.id
            }).then(() => {
            
                done.style.display = "none";
                document.getElementById("uploadedmssage").style.display = "block";
                setTimeout(() => {
                    location.reload();
                }, 2000);
            });
        }).catch((error) => {
            console.error("Error creating post: ", error);
        });
    } else {
    
        console.log("PostValue and URL cannot be empty");
    }
}
