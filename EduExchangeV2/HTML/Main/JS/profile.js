let userprofileimg = document.getElementById("userprofileimg");
let usercoverimg = document.getElementById("usercoverimg");
let progressbar1 = document.getElementById("progressbar");
let progressbardiv = document.getElementById("progressbardiv");
let Username = document.getElementById("Username");
let message = document.getElementById("message");
var postsshowbutton = document.getElementById("postsbutton");
var currentuserpost = document.getElementById("showposts");
var userdata = document.getElementById("editabledatadiv");
var showuserprofilebutton = document.getElementById("userprofilebutton");
let textareaupdate = document.getElementById("textareaupdate");
let fileType = "";
let uid;
let updateurl;
let allUsers = [];
let allposts = [];

let changecoverpicture = (event) => {
    var uploadfile = firebase
        .storage()
        .ref()
        .child(`users/${uid}/coverpicture`).put(event.target.files[0]);
    uploadfile.on(
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
            uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
                progressdiv.style.display = "none";
                firebase.firestore().collection("users").doc(uid).update({
                    Coverpicture: downloadURL
                })
            });
        }
    );
};

let changeprofilepicture = (event) => {
    var uploadfile = firebase
        .storage()
        .ref()
        .child(`users/${uid}/profilepicture`).put(event.target.files[0]);
    uploadfile.on(
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
            uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
                progressdiv.style.display = "none";
                firebase.firestore().collection("users").doc(uid).update({
                    ProfilePicture: downloadURL
                })
            });
        }
    );
};

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            firebase.firestore().collection("users").onSnapshot((result) => {
                result.forEach((userdata) => {
                    allUsers.push(userdata.data());
                    fileType = userdata.data().fileType;
                    if (userdata.data().uid === user.uid) {
                        if (userdata.data().ProfilePicture !== "" || userdata.data().Coverpicture !== "") {
                            userprofileimg.setAttribute("src", userdata.data().ProfilePicture || "https://t4.ftcdn.net/jpg/02/17/88/73/360_F_217887350_mDfLv2ootQNeffWXT57VQr8OX7IvZKvB.jpg");
                            usercoverimg.setAttribute("src", userdata.data().Coverpicture || "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg");
                        }
                    }
                });
            });
        } else {
            setTimeout(() => {
                window.location.assign("./Main/emailverification.html");
            });
        }
    } else {
        window.location.assign("./EduExchange/HTML/Main/Login.html");
    }
});
postsshowbutton.addEventListener("click", () => {
    userdata.style.display = "none";
    currentuserpost.style.display = "block";
    postsshowbutton.style.backgroundColor = "#0000ff";
    postsshowbutton.style.color = "white";
    showuserprofilebutton.style.backgroundColor = "white";
    showuserprofilebutton.style.color = "#0000ff";
    document.getElementById("currentuserpostsdiv").style.display = "flex";
  });
  showuserprofilebutton.addEventListener("click", () => {
    userdata.style.display = "block";
    currentuserpost.style.display = "none";
    showuserprofilebutton.style.backgroundColor = "#0000ff";
    showuserprofilebutton.style.color = "white";
    postsshowbutton.style.backgroundColor = "white";
    postsshowbutton.style.color = "#0000ff";
    document.getElementById("currentuserpostsdiv").style.display = "none";
  });

  
  let update = () => {
    let firstname = document.getElementById("firstname");
    let message = document.getElementById("message");
  
    if (firstname.value === "") {
        message.innerHTML = "Username Required";
        message.style.color = "red";
        firstname.focus();
    } else {
        var data = {
            Username: firstname.value,
        };
        console.log(data);
        firebase.firestore().collection("users").doc(uid).update(data)
            .then((res) => {
                console.log(res);
                message.innerHTML = "Successfully Updated";
                message.style.color = "green";
                setTimeout(() => {
                    message.innerHTML = "";
                }, 3000);
            })
            .catch((error) => {
                console.log(error);
            });
    }
};

var loading = document.getElementById("loaderdiv");
var showposts = document.getElementById("showposts");
firebase
  .firestore()
  .collection("posts")
  .onSnapshot((onSnapshot) => {
    firebase
      .firestore()
      .collection("posts")
      .where("uid", "==", uid)
      .get()
      .then((onSnapshot) => {
        console.log(onSnapshot);
        loading.style.display = "none";
        let allposts = [];
        if (onSnapshot.size === 0) {
          let nodata = document.getElementById("messagediv");
          nodata.style.display = "block";
        } else {
          onSnapshot.forEach((postres) => {
            allposts.push(postres.data());
          });
          showposts.style.display = "block";
          showposts.innerHTML = "";
          for (let i = 0; i < allposts.length; i++) {
            let likearry = allposts[i].like;
            let dislikearry = allposts[i].dislikes || [];
            let commentarry = allposts[i].comments || [];
            let postmain = document.createElement("div");
            showposts.appendChild(postmain);
            postmain.setAttribute("class", "postmain");
            //post header
            let postheader = document.createElement("div");
            postmain.appendChild(postheader);
            postheader.setAttribute("class", "postheader");
            // user data
            firebase
              .firestore()
              .collection("users")
              .doc(allposts[i].uid)
              .get()
              .then((res) => {
                let userprodiv = document.createElement("div");
                let userprofileimage = document.createElement("img");
                postheader.appendChild(userprodiv);
                userprodiv.setAttribute("class", "userprodiv");
                userprodiv.appendChild(userprofileimage);
                userprofileimage.setAttribute(
                  "src",
                  res.data().ProfilePicture === ""
                    ? "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                    : res.data().ProfilePicture
                );
                userprofileimage.setAttribute("class", "profileimage");
                let userdiv = document.createElement("div");
                userprodiv.appendChild(userdiv);
                userdiv.setAttribute("class", "col-6");
                let = username = document.createElement("h6");
                userdiv.appendChild(username);
                username.innerHTML = `${res.data().Username}`

                let = date = document.createElement("h6");
                userdiv.appendChild(date);
                date.innerHTML = `${allposts[i].Date} `;
                let postdetail = document.createElement("p");
                postheader.appendChild(postdetail);

                var editanddeltebtndiv = document.createElement("div");
                userprodiv.appendChild(editanddeltebtndiv);
                editanddeltebtndiv.setAttribute(
                  "class",
                  "editanddeletbtn col-4"
                );

                var editbtn = document.createElement("i");
                editanddeltebtndiv.appendChild(editbtn);
                editbtn.setAttribute("class", "fa-solid fa-pencil postsbtn");
                editbtn.setAttribute("id", "editbtn");

                // edit button
                editbtn.addEventListener("click", () => {
                  showposts.style.display = "none";
                  let maincreate = document.getElementById("maincreate");
                  let user = document.getElementById("userdiv");
                  let userprodiv = document.createElement("div");
                  let userprofileimage = document.createElement("img");
                  user.appendChild(userprodiv);
                  userprodiv.setAttribute("class", "userprodiv");
                  userprodiv.appendChild(userprofileimage);
                  userprofileimage.setAttribute(
                    "src",
                    res.data().ProfilePicture === ""
                      ? "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                      : res.data().ProfilePicture
                  );
                  userprofileimage.setAttribute("class", "profileimage");
                  let userdiv = document.createElement("div");
                  userprodiv.appendChild(userdiv);
                  userdiv.setAttribute("class", "col-6");
                  let = date = document.createElement("h6");
                  userdiv.appendChild(date);
                  date.innerHTML = `${allposts[i].Date} `;
                  let postdetail = document.createElement("p");
                  postheader.appendChild(postdetail);
                  maincreate.style.display = "block";
                  textareaupdate.innerHTML = allposts[i].postValue;

                  
                let updatepostbtn = document.getElementById("updatepostbtn");
                updatepostbtn.addEventListener("click", () => {
                  var aa = {
                    postValue: textareaupdate.value,
                    url: updateurl ||"",
                    filetype: fileType||""
                  };
                  firebase
                    .firestore()
                    .collection("posts")
                    .doc(allposts[i].id)
                    .update(aa)
                    .then(() => {
                      maincreate.style.display = "none";
                      showposts.style.display = "block";
                    });
                });
                });

                var deletbtn = document.createElement("i");
                editanddeltebtndiv.appendChild(deletbtn);
                deletbtn.setAttribute("class", "fa-solid fa-trash postsbtn");
                deletbtn.setAttribute("id", "deletebtn");
                deletbtn.style.marginLeft = "8px";

                // dlete button
                deletbtn.addEventListener("click", () => {
                  swal({
                    title: "Are you sure?",
                    text: "Once deleted, you will not be able to recover this Post !",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                  }).then((willDelete) => {
                    if (willDelete) {
                      swal("Poof! Your imaginary file has been deleted!", {
                        icon: "success"
                      });
                      firebase
                        .firestore()
                        .collection("posts")
                        .doc(allposts[i].id)
                        .delete();
                      //Message
                    } else {
                      swal("Your imaginary file is safe!");
                    }
                  });
                });

                postdetail.innerHTML = allposts[i].postValue;
                if (allposts[i].url !== "") {
                  if (
                    allposts[i].fileType === "image/png" ||
                    allposts[i].fileType === "image/jpeg" ||
                    allposts[i].fileType === "image/jpg"
                  ) {
                    // images
                    let postimage = document.createElement("img");
                    postmain.appendChild(postimage);
                    postimage.setAttribute("src", "");
                    postimage.setAttribute("src", allposts[i].url);
                    postimage.setAttribute("class", "postimage col-12");
                  } 
                }

                // footer
                let footerdiv = document.createElement("div");
                postmain.appendChild(footerdiv);
                footerdiv.setAttribute("class", "footerdiv");
                
                //like
                var likebutton = document.createElement("button");
                footerdiv.appendChild(likebutton);
                likebutton.setAttribute("class", "likebutton");

                //like icon 
                var likeicon = document.createElement("i");
                likebutton.appendChild(likeicon);
                likeicon.setAttribute("class", "fa-solid fa-thumbs-up");

                var liketitle = document.createElement("p");
                likebutton.appendChild(liketitle);
                liketitle.setAttribute("class", "impressionstitle");
                liketitle.innerHTML = `Like (${likearry.length})`;
                for (
                  let likeIndex = 0;
                  likeIndex < likearry.length;
                  likeIndex++
                ) {
                  if (likearry[likeIndex] === uid) {
                    likeicon.style.color = "blue";
                    liketitle.style.color = "blue";
                  }
                }
                //like function
                likebutton.addEventListener("click", () => {
                  let like = false;
                  for (
                    let likeIndex = 0;
                    likeIndex < likearry.length;
                    likeIndex++
                  ) {
                    if (likearry[likeIndex] === uid) {
                      like = true;
                      likearry.splice(likeIndex, 1);
                    }
                  }
                  if (!like) {
                    likearry.push(uid);
                  }
                  firebase
                    .firestore()
                    .collection("posts/")
                    .doc(allposts[i].id)
                    .update({
                      like: likearry
                    });
                });

                var dislikebutton = document.createElement("button");
                footerdiv.appendChild(dislikebutton);
                dislikebutton.setAttribute("class", "dislikebutton");

                var dislikeicon = document.createElement("i");
                dislikebutton.appendChild(dislikeicon);
                dislikeicon.setAttribute("class", "fa-solid fa-thumbs-down");

                var disliketitle = document.createElement("p");
                dislikebutton.appendChild(disliketitle);
                disliketitle.setAttribute("class", "impressionstitle");
                disliketitle.innerHTML = `Dislike (${dislikearry.length})`;
                for (
                  let dislikeindex = 0;
                  dislikeindex < dislikearry.length;
                  dislikeindex++
                ) {
                  if (dislikearry[dislikeindex] === uid) {
                    dislikeicon.style.color = "blue";
                    disliketitle.style.color = "blue";
                  }
                }
                dislikebutton.addEventListener("click", () => {
                  let dislike = false;
                  for (
                    let dislikeindex = 0;
                    dislikeindex < dislikearry.length;
                    dislikeindex++
                  ) {
                    if (dislikearry[dislikeindex] === uid) {
                      dislike = true;
                      dislikearry.splice(dislikeindex, 1);
                    }
                  }
                  if (!dislike) {
                    dislikearry.push(uid);
                  }
                  firebase
                    .firestore()
                    .collection("posts/")
                    .doc(allposts[i].id)
                    .update({
                      dislikes: dislikearry
                    });
                });

                let commentbutton = document.createElement("button");
                footerdiv.appendChild(commentbutton);

                var commenticon = document.createElement("i");
                commentbutton.appendChild(commenticon);
                commenticon.setAttribute("class", "fa-solid fa-message");

                var commentmessage = document.createElement("p");
                commentbutton.appendChild(commentmessage);
                commentmessage.setAttribute("class", "impressionstitle");
                commentmessage.innerHTML = `Comment (${commentarry.length})`;
                // comment fuction
                if (commentarry.length !== 0) {
                  for (
                    var commentindex = 0;
                    commentindex < commentarry.length;
                    commentindex++
                  ) {
                    let commentmain = document.createElement("div");
                    postmain.appendChild(commentmain);
                    commentmain.setAttribute("class", "commentmain");
                    let commentprofileimage = document.createElement("img");
                    commentmain.appendChild(commentprofileimage);
                    commentprofileimage.setAttribute(
                      "class",
                      "commentprofileimage"
                    );
                    var commentmessage = document.createElement("div");
                    let commentusername = document.createElement("h6");
                    commentmain.appendChild(commentmessage);
                    commentmessage.appendChild(commentusername);
                    //user data
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(commentarry[commentindex].uid)
                      .get()
                      .then((currentuserres) => {
                        commentprofileimage.setAttribute(
                          "src",
                          "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                        );
                        if (currentuserres.data().ProfilePicture !== "") {
                          commentprofileimage.setAttribute(
                            "src",
                            currentuserres.data().ProfilePicture
                          );
                        }
                        commentusername.innerHTML = `${
                          currentuserres.data().Username
                        }`;
                      });
                    let commentvalue = document.createElement("p");
                    commentmessage.appendChild(commentvalue);
                    commentvalue.innerHTML =
                      commentarry[commentindex].commentvalue;
                  }
                }
                let writecomment = document.createElement("div");
                writecomment.setAttribute("class", "writecomment");
                postmain.appendChild(writecomment);
                let commentinput = document.createElement("input");
                writecomment.appendChild(commentinput);
                commentinput.setAttribute("class", "commentinput");
                commentinput.setAttribute("placeholder", "Write Comment.....");
                let sendbutton = document.createElement("img");
                writecomment.appendChild(sendbutton);
                sendbutton.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/3682/3682321.png");
                sendbutton.setAttribute("class", "sendbutton");

                //comment fuction
                sendbutton.addEventListener("click", () => {
                  if (commentinput.value === "") {
                    alert("Please write something.....!");
                  } else {
                    let commentdata = {
                      commentvalue: commentinput.value,
                      uid: uid
                    };
                    commentarry.push(commentdata);
                    firebase
                      .firestore()
                      .collection("posts")
                      .doc(allposts[i].id)
                      .update({
                        comments: commentarry
                      });
                  }
                });
              });
          }
        }
      });
  });

let postfiles = (event) => {
  fileType = event.target.files[0].type;
  let progressdiv1 = document.getElementById("progressdiv1");
  let progressbar1 = document.getElementById("progressbar1");
  var uploadTask = firebase
    .storage()
    .ref()
    .child(event.target.files[0].name)
    .put(event.target.files[0]);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var uploadpercentage = Math.round(progress);
      console.log(uploadpercentage);
      progressdiv1.style.display = "block";
      progressbar1.style.width = `${uploadpercentage}%`;
      progressbar1.innerHTML = `${uploadpercentage}%`;
    },
    (error) => {},
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        updateurl = downloadURL;
        progressdiv1.style.display = "none";
      });
    }
  );
};


const logout = () => {
    firebase.auth().signOut().then(() => {
        window.location.assign("./EduExchange/HTML/Main/Login.html");
    });
};

