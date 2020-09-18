const tv = require('tvdb.js')('55286b6b9e90390a810aee34d1975447');
//const tv = require('tvdb.js')('9465cf0deebb2a1522d34f167ffb4586');
const fs = require('fs');
const path = require('path');
const sleep = require('util').promisify(setTimeout);


let availableTags = [];
async function tvdbnevkeres(nev) {
	const show = await tv.find(nev, 'hu');

	if (availableTags.includes(show.name) == false && show.name != "") {
		availableTags.push(show.name);
	}
}
async function egyszer(id) {
	const show = await tv.find(id);
	let fajlnev = "source/data/" + show.id + ".json";
	await fs.writeFileSync(fajlnev, JSON.stringify(show, null, 2));
}

async function frissitettadatlapok() {
	fs.readdir("source/data/", function(err, files) {
		if (err) {
			return uzenetek('Unable to scan directory: ' + err);
		}
		files.forEach(async function(file) {
			let fajlnev = "source/data/" + file;
			let rawdata = await fs.readFileSync(fajlnev);
			let show = JSON.parse(rawdata);

			var d = new Date();
			var n = d.getTime();
			var stats = fs.statSync(fajlnev);
			var mtime = stats.ctimeMs;
			if (show.status === "Continuing" && mtime < (n - (1 * 86400000))) {
				const showweb = await tv.find(path.parse(file).name);
				await fs.writeFileSync(fajlnev, JSON.stringify(showweb, null, 2));
				uzenetek("Adatok frissitve a sorozatról!");

			} else {
				uzenetek("Nincs mit frissíteni!");
			}

			//console.log(path.parse(file).name);
		});
	});
}

async function tvdbobjekletolt(id) {
	document.getElementById("loading").innerHTML = '<center><img src="img/294.gif" alt="Töltés"></center>';
	try {
		const show = await tv.find(id);
		let fajlnev = "source/data/" + show.id + ".json";
		let hatter = 'https://thetvdb.com/banners/' + show.poster;
		// if (show.name != "") {
		// 	document.getElementById("ujname").value = show.name;
		// }

		await downloadIMG(hatter, id); // borito letoltese

		if (show.status === "Ended" && !fs.existsSync(fajlnev)) {
			await fs.writeFileSync(fajlnev, JSON.stringify(show, null, 2));
			uzenetek("Adatok letöltve a sorozatról!");

		} else if (show.status === "Continuing") {
			//  console.log("folytatodik");
			var d = new Date();
			var n = d.getTime();

			if (fs.existsSync(fajlnev)) {
				var stats = fs.statSync(fajlnev);
				var mtime = stats.ctimeMs;
				//  console.log("létezik");
				if (mtime < (n - (1 * 86400000))) {
					//    console.log(mtime);
					await fs.writeFileSync(fajlnev, JSON.stringify(show, null, 2));
					uzenetek("Adatok letöltve a sorozatról!");
				}
			} else if (!fs.existsSync(fajlnev)) {
				console.log("nem létezik");
				await fs.writeFileSync(fajlnev, JSON.stringify(show, null, 2));
			}
		}
	} catch (err) {
		uzenetek(err);
	} finally {
		document.getElementById("loading").innerHTML = "";
	}

} //tvdbobjektletolt vege


async function mennyiresz(id, tvdbreevad, key) {
	try {
		let show;
		document.getElementById("loading").innerHTML = '<center> <img src="img/294.gif" alt="Töltés"></center>';
		let fajlnev = "source/data/" + id + ".json";
		if (fs.existsSync(fajlnev)) {
			let rawdata = await fs.readFileSync(fajlnev);
			show = JSON.parse(rawdata);
		} else {
			show = await tv.find(id);
		}
		let mennyireszvan = await show.episodes.filter(obj => obj.season === parseInt(tvdbreevad, 10));

		if (key != "1") {
			let postRef = ref.child(key);
			postRef.transaction(function(post) {
				if (post) {
					post.Episodeyear = mennyireszvan.length;
					console.log(mennyireszvan.length);
				}
				return post;
			});
		} else {
			document.getElementById("ujmas").value = show.id;
			document.getElementById("ujresz").value = 0;
			document.getElementById("ujreszevad").value = mennyireszvan.length;

		}


	} catch (err) {
		uzenetek(err);
	}
} //az aktualis evadban mennyi resz van?

async function koviresz() {
	//// TODO: kitakaritani ezt a szar
	await new Promise(resolve => setTimeout(resolve, 2000));
	const fileok = fs.readdir("source/data/", function(err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		for (var i = 0; i < files.length; i++) {
			let csakid = path.parse(files[i]).name;
			try {
				var string = document.getElementById(csakid + '33').textContent;
				// var string =   document.querySelector(csakid + '33').textContent;
				// var string = "S1/E2";
				var res = string.split("S");
				var res2 = res[1].split("/");
				var res3 = res2[1].split("E");
				let evadszam = parseInt(res2[0], 10);
				let reszszam = parseInt(res3[1], 10);

				let rawdata = fs.readFileSync("source/data/" + files[i]);
				const show = JSON.parse(rawdata);

				const episode = show.episodes.find(ep => ep.number == (reszszam + 1) && ep.season == evadszam);
				// console.log(show.name, evadszam, reszszam + 1);
				if (episode != undefined && document.getElementById(csakid) != null) {

					if (Date.parse(episode.firstaired) + beproba.kesletetes > Date.now()) {
						document.getElementById(csakid).innerHTML = episode.firstaired;
						document.getElementById(csakid).style.color = "orange";
						document.getElementById(show.name).disabled = true;
						document.getElementById(show.name).title += episode.name;
						document.getElementById(csakid + "2").title = show.overview;

					} else {
						//tvdbobjekletolt(tvdbkod) ;
						document.getElementById(csakid + "2").title = show.overview;
						document.getElementById(csakid).innerHTML = episode.firstaired;
						document.getElementById(show.name).title += episode.name;

					}
				} else {
					//  document.getElementById(tvdbkod).innerHTML = "majd egyszer";
					if (show.status == "Ended" && document.getElementById(csakid) != null) {
						document.getElementById(csakid + "2").title = show.overview;
						document.getElementById(csakid).innerHTML = "Vége";
						document.getElementById(csakid).style.color = "red";
						document.getElementById(show.name).disabled = true;
					}
					if (show.status == "Continuing" && document.getElementById(csakid) != null) {
						document.getElementById(csakid + "2").title = show.overview;
						document.getElementById(csakid).innerHTML = "Gyártás alatt";
						document.getElementById(csakid).style.color = "#3e6fbd";
						document.getElementById(show.name).disabled = true;
					}
				}
			} catch (e) {}
		} //for vege
	});
}