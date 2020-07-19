const tv = require('tvdb.js')('55286b6b9e90390a810aee34d1975447')

async function tvdbobjekletolt(id) {
  document.getElementById("loading").innerHTML = '<center><img src="img/294.gif" alt="Töltés"></center>';
  let fajlnev = "source/data/" + id + ".json";

  try {
    const show = await tv.find(id);
    let hatter = 'https://thetvdb.com/banners/' + show.poster;
    if (show.name != "") {
      document.getElementById("ujname").value = show.name;
    }

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
  }

  document.getElementById("loading").innerHTML = "";

} //tvdbobjektletolt vege

async function tvdba(tvdbkod, tvdbreevad, tvdbreresz, ids, nev) {
  try {
    let show;
    let fajlnev = "source/data/" + tvdbkod + ".json";



    if (fs.existsSync(fajlnev)) {
      let rawdata = await fs.readFileSync(fajlnev);
      show = JSON.parse(rawdata);
    } else {
      show = await tv.find(tvdbkod);
    }

    const episode = show.episodes.find(ep => ep.number == tvdbreresz && ep.season == tvdbreevad);

    if (episode != undefined && document.getElementById(tvdbkod) != null) {

      if (Date.parse(episode.firstaired) + beproba.kesletetes > Date.now()) {
        document.getElementById(tvdbkod).innerHTML = episode.firstaired;
        document.getElementById(tvdbkod).style.color = "orange";
        document.getElementById(nev).disabled = true;
        document.getElementById(nev).title += episode.name;
        document.getElementById(tvdbkod + "2").title = show.overview;

      } else {
        //tvdbobjekletolt(tvdbkod) ;
        document.getElementById(tvdbkod + "2").title = show.overview;
        document.getElementById(tvdbkod).innerHTML = episode.firstaired;
        document.getElementById(nev).title += episode.name;

      }
    } else {
      //  document.getElementById(tvdbkod).innerHTML = "majd egyszer";
      if (show.status == "Ended" && document.getElementById(tvdbkod) != null) {
        document.getElementById(tvdbkod + "2").title = show.overview;
        document.getElementById(tvdbkod).innerHTML = "Vége";
        document.getElementById(tvdbkod).style.color = "red";
        document.getElementById(nev).disabled = true;
      }
      if (show.status == "Continuing" && document.getElementById(tvdbkod) != null) {
        document.getElementById(tvdbkod + "2").title = show.overview;
        document.getElementById(tvdbkod).innerHTML = "Gyártás alatt";
        document.getElementById(tvdbkod).style.color = "#3e6fbd";
        document.getElementById(nev).disabled = true;
      }

    }


  } catch (err) {
    uzenetek(err);
  }
} //mikor lesz a kovetkezo rész?

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

    let postRef = ref.child(key);
    postRef.transaction(function(post) {
      if (post) {
        post.Episodeyear = mennyireszvan.length;
        console.log(mennyireszvan.length);
      }
      return post;
    });

  } catch (err) {
    uzenetek(err);
  }
} //az aktualis evadban mennyi resz van?


async function shower(melyiket) {

  let rawdata = fs.readFileSync(tarolo);
  let obj = JSON.parse(rawdata);
  let nev, evad, evadperresz, resz, archiv, ut, mas;

  people = sortByKey(obj.data, beproba.miszerint); //sorbarakás abc

  for (var i = 0; i < obj.data.length; i++) {
    nev = obj.data[i].Name;
    resz = obj.data[i].Episode;
    evad = obj.data[i].Season;
    ut = obj.data[i].Path;

    archiv = obj.data[i].Archive;
    mas = obj.data[i].Other;
    evadperresz = obj.data[i].Episodeyear;
    let modos = resz + 1;

    if (archiv == melyiket && mas > 0) {
      //console.log("megvgay");
      await tvdba(parseInt(mas, 10), parseInt(evad, 10), parseInt(modos, 10), i, nev);
      // kod alapjan kereses

    }
  } //for ege
} //tvdba melyik resz fő funciója

document.getElementById("ujmas").onchange = function() {
  tvdbobjekletolt(document.getElementById("ujmas").value);
  mennyiresz(document.getElementById("ujmas").value, document.getElementById("ujevad").value, 1);

}; //ez mindig lefut ha a tvdbid changed
