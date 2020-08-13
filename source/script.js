const nwGui = require('nw.gui');
const readdirp = require('readdirp');
const open = require("open");
const tarolo = "source/tarolo.json";

const beproba = {
	miszerint: 'Name',
	settingshelyzet: true,
	kesletetes: 3600000 * 8 //8ora
}
// fajl vagy webcim megnyitása
function nyit(mit) {
	if (mit != null) {
		try {
			open(mit);
		} catch (e) {
			uzenetek(e);
		}
	}
}
// mappa kiválasztása uj elem hozzaadasakor
function selectFolder(e) {
	var theFiles = e.target.files;
	var relativePath = theFiles[0].path;

	let kivagni = theFiles[0].webkitRelativePath;
	let kivagnielso = kivagni.split("/");
	var folder = relativePath.split(kivagni);
	let osszerakva = folder[0] + kivagnielso[0];
	document.getElementById("ujhely").value = osszerakva;
}
// checkbox helyzet tárolás
function setupBox(box) {
	var storageId = box.getAttribute("store");
	var oldVal = localStorage.getItem(storageId);
	box.checked = oldVal === "true" ? true : false;
	box.addEventListener("change", function() {
		localStorage.setItem(storageId, this.checked);
	});
}

// uj elem form mutatása
function ujelem(mit) {
	urit();
	var x = document.getElementById(mit);
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

function doSomething(elem) {
	var alt = document.createTextNode(elem.getAttribute('alt'));
	elem.parentNode.insertBefore(alt, elem);
	elem.parentNode.removeChild(elem);
}
// fodarab teglalap mutatása
async function show(melyiket) {
	document.getElementById('sorozatok').innerHTML = "";

	ref.orderByChild("Name").on('value', function(data) {

		document.getElementById("sorozatok").innerHTML = "";
		data.forEach(function(childSnapshot) {
			let nev, evad, evadperresz, resz, archiv, ut, mas;

			// key will be "ada" the first time and "alan" the second time
			var k = childSnapshot.key;
			// childData will be the actual contents of the child

			var fireadatok = childSnapshot.val();

			nev = fireadatok.Name;
			evad = fireadatok.Season;
			resz = fireadatok.Episode;
			ut = fireadatok[computerName];

			archiv = fireadatok.Archive;
			mas = fireadatok.Other;
			evadperresz = fireadatok.Episodeyear;


			if (archiv == melyiket) {

				var new_egesz = document.createElement('div');
				new_egesz.className = "egesz";
				var new_felso = document.createElement('div');
				new_felso.className = "peldany";
				new_felso.id = i;

				var new_kep = document.createElement('img');
				new_kep.setAttribute("src", './img/poster/' + mas + '.jpg');
				new_kep.setAttribute("alt", nev);
				new_kep.setAttribute("width", 90);
				new_kep.setAttribute("height", 130);
				new_kep.setAttribute("title", nev);
				new_kep.setAttribute("id", mas + "2");
				new_kep.setAttribute("onerror", "doSomething(this)");

				var new_felsodatum = document.createElement('div');
				new_felsodatum.className = "hatter";
				new_felsodatum.id = mas;

				var new_felsoevadresz = document.createElement('div');
				new_felsoevadresz.className = "adat2";
				new_felsoevadresz.id = mas + "33";
				// new_felsoevadresz.innerHTML = "S" + evad + "/E" + resz;
				new_felsoevadresz.innerHTML = `S${evad}/E${resz}`;

				var new_also = document.createElement('div');
				new_also.className = "gombos";
				new_also.setAttribute("title", nev);

				var gomb_egy = document.createElement('input');
				gomb_egy.setAttribute("type", "button");
				gomb_egy.setAttribute("target", "ujel");
				gomb_egy.setAttribute("onclick", `modositas(${evad}, ${resz},${evadperresz},'${ut}','${nev}',${archiv},${mas},'${k}')`);
				gomb_egy.className = "a512 kicsigombik";

				var gomb_ketto = document.createElement('input');
				gomb_ketto.setAttribute("type", "button");
				gomb_ketto.setAttribute("target", "ujel");
				gomb_ketto.setAttribute("onclick", 'nyit(\'' + ut + '\')');
				gomb_ketto.className = "a523 kicsigombik";

				var gomb_harom = document.createElement('input');
				gomb_harom.setAttribute("type", "button");
				gomb_harom.setAttribute("target", "ujel");
				gomb_harom.id = nev;
				gomb_harom.setAttribute("onclick", ' fbnovelo(\'' + k + '\')');
				let noveltt = parseInt(resz, 10) + 1;
				gomb_harom.setAttribute("onmouseover", `mappatartalom('${ut}', ${evad},${noveltt},1,'${nev}')`);
				gomb_harom.className = "a51 kicsigombik";
				gomb_harom.setAttribute("title", resz + 1 + '/' + evadperresz + ' ');

				if (ValidURL(ut)) {
					gomb_harom.setAttribute("style", "background-color:white;  border-radius: 50%");
				} else if (!ValidURL(ut) && ut != "") {
					gomb_harom.setAttribute("style", "background-color: #bcdba7;  border-radius: 50%");
				}
				document.getElementById("sorozatok").appendChild(new_egesz);
				new_egesz.appendChild(new_felso);
				new_egesz.appendChild(new_also);
				new_felso.appendChild(new_kep);
				new_felso.appendChild(new_felsodatum);
				new_felso.appendChild(new_felsoevadresz);
				new_also.appendChild(gomb_egy);
				new_also.appendChild(gomb_ketto);
				new_also.appendChild(gomb_harom);
			}
			// itt lehet egyesivel feldolgozni
		});
		koviresz();
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	// koviresz();
}

function uzenetek(mituzensz) {
	document.getElementById("fontosuzi").innerHTML = "";
	document.getElementById("fontosuzi").style.display = "block";
	document.getElementById("fontosuzi").innerHTML = mituzensz;
	setTimeout(function() {
		document.getElementById('fontosuzi').style.display = 'none'
	}, 7000);
}
// következo resz megtaláló
function mappatartalom(mappas, evadsa, reszsa, opcio, nev) {
	let minden = [];
	var jo;

	if (fs.existsSync(mappas)) {
		readdirp(mappas, {
				fileFilter: ['*.mkv', '*.avi', '*.mp4'],
				alwaysStat: false
			})
			.on('data', (entry) => {
				const {
					fullPath,
					path
				} = entry;

				var novelt = reszsa + 1;
				//  minta = '[Ss]?0?'+evadsa+'[XeEe]?0?('+reszsa+')\D';
				//  minta = /[Ss]?0?${evadsa}[XeEe]?0?(${resza})\D/g;

				if (evadsa < 10) {
					var minta = '\.[sS]?0';
				} else {
					var minta = '\.[sS]?';
				}
				minta += evadsa;

				if (reszsa < 10) {
					minta += '[xXeE]?0';
				} else {
					minta += '[xXeE]?';
				}
				minta += reszsa;
				var output = fullPath.split("/").pop();
				var patt = new RegExp(minta);
				var res = patt.exec(output);
				if (res && output.toLowerCase().indexOf("sample") === -1) {
					minden.push(fullPath);
					jo = fullPath;
					if (opcio === 1) {
						uzenetek(output);
					} else {
						console.log(minden[0]);
						nyit(minden[0]);
					}
				}
			})
	}
}

function urit() {
	document.getElementById("ujname").value = "";
	document.getElementById("ujresz").value = "";
	document.getElementById("ujevad").value = "1";
	document.getElementById("ujreszevad").value = "";
	document.getElementById("ujhely").value = "";
	document.getElementById("ujmas").value = "";
	// document.getElementById("hiddeninput").value = "";
	document.getElementById("beallitas7").checked = true;
	document.getElementById("FileUpload").value = '';
	document.getElementById("szepislesz").click();

}





function extractHostname(url) {
	var hostname;
	if (url.indexOf("//") > -1) {
		hostname = url.split('/')[2];
	} else {
		hostname = url.split('/')[0];
	}
	hostname = hostname.split(':')[0];
	hostname = hostname.split('?')[0];
	return hostname;
}

function webnezo(url, evad, resz) {
	this.resz = resz + 1;
	var linke;
	var valami;

	if (extractHostname(url) == "netmozi.com" && document.getElementById("beallitas2").checked == true) {

		if (url.indexOf("//") > -1) {
			linke = url.split('/').slice(0, 6).join('/') + "/s" + evad + "/e" + resz;
		}
	} //netmozi url kezelo
	else if (extractHostname(url) == "www.sorozatbarat.online" && document.getElementById("beallitas5").checked == true) {
		if (url.indexOf("//") > -1) {
			if (evad > 9) {
				if (resz > 9) {
					mino = "#" + evad + "_evad_" + resz + "_resz";
				} else {
					mino = "#" + evad + "_evad_0" + resz + "_resz";
				}
				linke = url.split('/').slice(0, 7).join('/') + "/" + evad + "_evad" + mino;
			} else {
				if (resz > 9) {
					mino = "#0" + evad + "_evad_" + resz + "_resz";
				} else {
					mino = "#0" + evad + "_evad_0" + resz + "_resz";
				}
				linke = url.split('/').slice(0, 7).join('/') + "/0" + evad + "_evad" + mino;
			}
		}
	} //sorozatbarat url kezelo

	nyit(linke);
}

function ValidURL(str) {
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if (!regex.test(str)) {
		return false;
	} else {
		return true;
	}
}

var boxes = document.querySelectorAll("input[type='checkbox']");

for (var i = 0; i < boxes.length; i++) {
	var box = boxes[i];
	if (box.hasAttribute("store")) {
		setupBox(box);
	}
}

function myF() {
	document.getElementById("myDropdown").classList.toggle("show");
}

function backupfunk() {

	// TODO: firebase to json

}

window.onclick = function(e) {
	if (!e.target.matches('.dropbtn')) {
		var myDropdown = document.getElementById("myDropdown");
		if (myDropdown.classList.contains('show')) {
			myDropdown.classList.remove('show');
		}
	}
}

async function egyszerremindet() {
	let rawdata = fs.readFileSync("source/sori-eafc4-export20200803.json");
	// let rawdata = fs.readFileSync(tarolo);
	let obj = JSON.parse(rawdata);

	let nev, evad, evadperresz, resz, archiv, ut, mas, jsonban;

	// console.log(obj);

	for (var i = 0; i < obj.data.length; i++) {

		jsonban = {
			"Archive": obj.data[i].Archive,
			"Episode": obj.data[i].Episode,
			"Episodeyear": obj.data[i].Episodeyear,
			"Name": obj.data[i].Name,
			"Other": obj.data[i].Other,
			"Path": {
				"kinka-pc": obj.data[i]["kinka-pc"],
				"Lenovo": obj.data[i].Lenovo
			},
			"Season": obj.data[i].Season,
			"timestamp": Date.now()
		};
		fbcollectionimport(jsonban);


		// ref.push(jsonban);
	} //for ege


} //egyszerremindet()vege
// egyszerremindet();








var x = document.getElementById("ujname");
x.addEventListener("keydown", function(e) {
	tvdbnevkeres(x.value);
	$('ujname').autocomplete('search', {
		minLength: 0
	});
});




var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function(snap) {
	if (snap.val() === true) {
		uzenetek("Kapcsolódva!");
	} else {
		uzenetek("Kapcsolódás");
	}
});


show(1);