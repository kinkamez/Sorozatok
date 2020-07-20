const os = require('os');
const computerName = os.hostname();
let firebaseConfig = {
  apiKey: "AIzaSyAe3u3kDmkd-GS-P_VqnVQZuFpl1hr90Yw",
  authDomain: "sori-eafc4.firebaseapp.com",
  databaseURL: "https://sori-eafc4.firebaseio.com",
  projectId: "sori-eafc4",
  storageBucket: "sori-eafc4.appspot.com",
  messagingSenderId: "375141845326",
  appId: "1:375141845326:web:926d97b2ea89f6adcaf61f",
  measurementId: "G-R54DLTRQRN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.database();
let ref = database.ref('data');

// NE HASZNÁLD csak ha elcseszted az adatbázist! mindent átír a json -> firebase


// firebase hiba kijelző
function errData(err) {
  console.log(err);
}


let nev, evad, evadperresz, resz, archiv, ut, mas;


 function fbnovelo(key) {
  let postRef = ref.child(key);
  postRef.transaction(function(post) {
    if (post) {
      if (post.Episode == (post.Episodeyear - 1)) {
        post.Episode = 0;
        post.Season++;
        // post.Episodeyear = mennyiresz(post.Other,post.Season);

        if (confirm("Rejtettek közé helyezés?")) {
          post.Archive = 2;
        }
      } else {
        post.Episode++;
        // post.Episodeyear = mennyiresz(post.Other,post.Season);
      }
        mennyiresz( post.Other,  post.Season, key) ;
      if (ValidURL(post[computerName]) == false && document.getElementById("beallitas1").checked) {
        mappatartalom(post[computerName], post.Season, post.Episode, 0, post.Name);
      } else if (ValidURL(post[computerName]) && document.getElementById("beallitas1").checked) {
        webnezo(post[computerName], post.Season, post.Episode);
      }
      // TODO: mennyi az összes rész? check és beírni.
    }
    return post;
  });

} // fbnovelo

function fbtorol(key) {
  let torlendo = ref.child(key);
  torlendo.remove()
}

document.getElementById("torlogomb").addEventListener("click", function() {
  if (document.getElementById("hiddeninput").value != "") {
    console.log("torol");
    console.log(document.getElementById("hiddeninput").value);
    fbtorol(document.getElementById("hiddeninput").value);
    document.getElementById("hiddeninput").value = "";
  }
});
