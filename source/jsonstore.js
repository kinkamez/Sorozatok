const os = require('os');
const computerName = os.hostname();

const admin = require("firebase-admin");
const serviceAccount = require("serviceAccount.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://sori-eafc4.firebaseio.com"
});

const database = admin.database();
const ref = database.ref("data");
let nev, evad, evadperresz, resz, archiv, ut, mas;


function fbnovelo(key) {
	let postRef = ref.child(key);
	postRef.transaction(function(post) {
		if (post) {
			if (ValidURL(post[computerName]) == false && document.getElementById("beallitas1").checked) {
				mappatartalom(post[computerName], post.Season, post.Episode + 1, 0, post.Name);
			} else if (ValidURL(post[computerName]) && document.getElementById("beallitas1").checked) {
				webnezo(post[computerName], post.Season, post.Episode);
			}
			if (post.Episode == (post.Episodeyear - 1)) {
				post.Episode = 0;
				post.Season++;

				if (confirm("Rejtettek közé helyezés?")) {
					post.Archive = 2;
				}
			} else {
				post.Episode++;
			}
			mennyiresz(post.Other, post.Season, key);
			tvdbobjekletolt(post.Other);
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
		uzenetek("Törlés!");
		fbtorol(document.getElementById("hiddeninput").value);
		document.getElementById("hiddeninput").value = "";
	}
});