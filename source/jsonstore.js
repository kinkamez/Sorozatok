const os = require('os');
const computerName = os.hostname();
const admin = require("firebase-admin");
const serviceAccount = require("serviceAccount.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	// databaseURL: "https://sori-eafc4.firebaseio.com"
	databaseURL: "https://adatbazis-b1da0.firebaseio.com"
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
				webnezo(post[computerName], post.Season, post.Episode + 1);
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

function modositas(evadas, reszadas, maxadas, helyadas, nevadas, arhiva, masska, key) {
	urit();
	ujelem("ujel");
	document.documentElement.scrollTop = 0;
	document.getElementById("ujname").value = nevadas;
	document.getElementById("ujresz").value = reszadas;
	document.getElementById("ujevad").value = evadas;
	document.getElementById("ujreszevad").value = maxadas;
	document.getElementById("ujhely").value = helyadas;
	document.getElementById("ujmas").value = masska;
	document.getElementById("hiddeninput").value = key;

	if (arhiva == 1) {
		document.getElementById("beallitas7").checked = true;
	} else if (arhiva == 2) {
		document.getElementById("beallitas7").checked = false;
	}
}
async function newe() {
	let result, newPostKey, valtozo;
	if (document.getElementById("beallitas7").checked == true) {
		result = 1;
	} else {
		result = 2;
	}
	let beirandoobj = {
		"Name": document.getElementById("ujname").value,
		"Archive": parseInt(result, 10),
		"Season": parseInt(document.getElementById("ujevad").value, 10),
		"Episode": parseInt(document.getElementById("ujresz").value, 10),
		"Episodeyear": parseInt(document.getElementById("ujreszevad").value, 10),
		[computerName]: document.getElementById("ujhely").value,
		"Other": parseInt(document.getElementById("ujmas").value, 10)
	};

	try {
		if (document.getElementById("hiddeninput").value != "") {
			newPostKey = document.getElementById("hiddeninput").value;
			//document.getElementById("hiddeninput").value = "";
		} else {
			newPostKey = admin.database().ref().child('posts').push().key;
			//document.getElementById("hiddeninput").value = "";
		}

		admin.database().ref('data/' + newPostKey).update(beirandoobj); //firebaseba
	} catch (e) {
		uzenetek(e);
	} finally {
		uzenetek("A művelet sikeres!");
		urit();
		ujelem("ujel");
	}
} //neww vege


document.getElementById("torlogomb").addEventListener("click", function() {
	if (document.getElementById("hiddeninput").value != "") {
		uzenetek("Törlés!");
		fbtorol(document.getElementById("hiddeninput").value);
		document.getElementById("hiddeninput").value = "";
	}
});