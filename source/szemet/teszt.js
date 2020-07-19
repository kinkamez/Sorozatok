const nwGui = require('nw.gui');
const path = require('path');
const fs = require('fs');
const tarolo = "source/tarolo.json";
const readdirp = require('readdirp');

function nyit(mit) {
  var open = require("open");
  open(mit);
}
function selectFolder(e) {
    var theFiles = e.target.files;
    var relativePath = theFiles[0].path;
    let kivagni = theFiles[0].webkitRelativePath;
    let kivagnielso= kivagni.split("/");
    var folder = relativePath.split(kivagni);
    let osszerakva = folder[0] + kivagnielso[0];

    document.getElementById("ujhely").value = osszerakva ;

}

function setupBox(box) {
  var storageId = box.getAttribute("store");
  var oldVal = localStorage.getItem(storageId);
  //console.log(oldVal);
  box.checked = oldVal === "true" ? true : false;

  box.addEventListener("change", function() {
    localStorage.setItem(storageId, this.checked);
  });
}



function ujelem(mit) {
  var x = document.getElementById(mit);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function doSomething(elem) {
  var alt = document.createTextNode(elem.getAttribute('alt'));

  elem.parentNode.insertBefore(alt, elem);

  elem.parentNode.removeChild(elem);
}

async function show(melyiket) {
  document.getElementById('sorozatok').innerHTML = "";
  let rawdata = fs.readFileSync(tarolo);
  let obj = JSON.parse(rawdata);
  let nev, evad, evadperresz, resz, archiv, ut, mas;

  people = sortByKey(obj.data, 'Name'); //sorbarakás abc

  for (var i = 0; i < obj.data.length; i++) {
    nev = obj.data[i].Name;
    resz = obj.data[i].Episode;
    evad = obj.data[i].Season;
    ut = obj.data[i].Path;

    archiv = obj.data[i].Archive;
    mas = obj.data[i].Other;
    evadperresz = obj.data[i].Episodeyear;
    //let modos = resz + 1;

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
      new_kep.setAttribute("onerror", "doSomething(this)");

      var new_felsodatum = document.createElement('div');
      new_felsodatum.className = "hatter";
      new_felsodatum.id = mas;

      var new_felsoevadresz = document.createElement('div');
      new_felsoevadresz.className = "adat2";
      new_felsoevadresz.innerHTML = "S" + evad + "/E" + resz;

      var new_also = document.createElement('div');
      new_also.className = "gombos";
      new_also.setAttribute("title", nev);

      var gomb_egy = document.createElement('input');
      gomb_egy.setAttribute("type", "button");
      gomb_egy.setAttribute("target", "ujel");
      gomb_egy.setAttribute("onclick", 'modositas(\'' + evad + '\',\'' + resz + '\',\'' + evadperresz + '\',\'' + ut + '\',\'' + nev + '\',\'' + archiv + '\',\'' + mas + '\')');
      gomb_egy.className = "a512 kicsigombik";

      var gomb_ketto = document.createElement('input');
      gomb_ketto.setAttribute("type", "button");
      gomb_ketto.setAttribute("target", "ujel");
      gomb_ketto.setAttribute("onclick", 'nyit(\'' + ut + '\')');
      gomb_ketto.className = "a523 kicsigombik";

      var gomb_harom = document.createElement('input');
      gomb_harom.setAttribute("type", "button");
      gomb_harom.setAttribute("target", "ujel");
      // gomb_harom.setAttribute("title", "ujel");
      gomb_harom.id = nev;
      gomb_harom.setAttribute("onclick", 'megNez(\'' + nev + '\')');
      gomb_harom.className = "a51 kicsigombik";


      if (ValidURL(ut)) {
        gomb_harom.setAttribute("style", "background-color:white;  border-radius: 50%");
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
  } //for ege
  if (document.getElementById("beallitas4").checked == true) {
    shower(melyiket);
  }
}

function mappatartalom(mappas, evadsa, reszsa) {
  let minden = [];
  var jo;

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


      if (evadsa < 10) {
        var minta = '[sS]?0';
      } else {
        var minta = '[sS]?';
      }
      minta += evadsa;
      if (reszsa < 10) {
        minta += '[xXeE]?0';
      } else {
        minta += '[xXeE]?';
      }


      minta += reszsa;
      //  var minta = 'S02E02';


      var patt = new RegExp(minta);
      var res = patt.exec(fullPath);
      if (res) {
        minden.push(fullPath);
        jo = fullPath;
        nyit(jo);
      }


    })
  //console.log(minden, jo);

}


async function newe() {
  // var e = document.getElementById("ujarhive");
  // var result = e.options[e.selectedIndex].value;

  // await tvdbobjekletolt(parseInt(document.getElementById("ujmas").value, 10));


  var result;
  if (document.getElementById("beallitas7").checked == true) {
    result = 1;
  } else {
    result = 2;
  }
  fs.readFile(tarolo, function(err, data) {
    var json = JSON.parse(data);

    json['data'].push({
      "Name": document.getElementById("ujname").value,
      "Archive": parseInt(result, 10),
      "Season": parseInt(document.getElementById("ujevad").value, 10),
      "Episode": parseInt(document.getElementById("ujresz").value, 10),
      "Episodeyear": parseInt(document.getElementById("ujreszevad").value, 10),
      "Path": document.getElementById("ujhely").value,
      "Other": parseInt(document.getElementById("ujmas").value, 10)
    });
    fs.writeFileSync(tarolo, JSON.stringify(json, null, 2));

    urit();
  ujelem("ujel");
  })
} //neww vege

function urit() {
  document.getElementById("ujname").value = "";
  document.getElementById("ujresz").value = "";
  document.getElementById("ujevad").value = "";
  document.getElementById("ujreszevad").value = "";
  document.getElementById("ujhely").value = "";
  document.getElementById("ujmas").value = "";
  document.getElementById("beallitas7").checked = true;
  document.getElementById("szepislesz").click();

}

function modositas(evadas, reszadas, maxadas, helyadas, nevadas, arhiva, masska) {
  urit();
  ujelem("ujel");
  document.documentElement.scrollTop = 0;
  document.getElementById("ujname").value = nevadas;
  document.getElementById("ujresz").value = reszadas;
  document.getElementById("ujevad").value = evadas;
  document.getElementById("ujreszevad").value = maxadas;
  document.getElementById("ujhely").value = helyadas;
  document.getElementById("ujmas").value = masska;
  if (arhiva == 1) {
    document.getElementById("beallitas7").checked = true;
  } else if (arhiva == 2) {
    document.getElementById("beallitas7").checked = false;
  }

  let rawdata = fs.readFileSync(tarolo);
  let obj = JSON.parse(rawdata);
  let nev, evad, evadperresz, resz, archiv, ut, mas;

  for (var i = 0; i < obj.data.length; i++) {
    nev = obj.data[i].Name;
    resz = obj.data[i].Episode;
    evad = obj.data[i].Season;
    ut = obj.data[i].Path;

    archiv = obj.data[i].Archive;
    mas = obj.data[i].Other;
    evadperresz = obj.data[i].Episodeyear;

    if (nev == nevadas) {

      // törlés
      //  console.log(obj.data);
      var deletedItem = obj.data.splice(i, 1);
      //  console.log(obj.data);
      fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
    }
  } //for ege
}
async function megNez(kapott_nev) {


  let rawdata = fs.readFileSync(tarolo);
  let obj = JSON.parse(rawdata);
  let nev, evad, evadperresz, resz, archiv, ut, mas;


  for (var i = 0; i < obj.data.length; i++) {
    nev = obj.data[i].Name;

    resz = parseInt(obj.data[i].Episode, 10);
    evad = parseInt(obj.data[i].Season, 10);
    evadperresz = parseInt(obj.data[i].Episodeyear, 10);

    ut = obj.data[i].Path;
    mas = obj.data[i].Other;


    if (nev == kapott_nev) {

      if (resz == (evadperresz - 1)) {
        obj.data[i].Episode = 0;
        resz = 0;
        obj.data[i].Season = evad + 1;
        evad++;

        if (confirm("Rejtettek közé helyezés?")) {
          obj.data[i].Archive = 2;

        }
        // else {
        //   await mennyiresz(mas, evad);
        // }

        fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));

      } else {
        obj.data[i].Episode = resz + 1;
        resz++;
        fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
      }
      if (ValidURL(ut) == false && document.getElementById("beallitas1").checked) {
        mappatartalom(ut, evad, resz);
      } else if (ValidURL(ut) && document.getElementById("beallitas1").checked) {

        webnezo(ut, evad, resz);
      }

        await mennyiresz(mas, evad);
    } // eddig egyenlo a ketto nev
  } //for ege

  document.getElementById("szepislesz").click();
}


function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];
  return hostname;
}

function webnezo(url, evad, resz) {

  var linke;
var valami;

  if (extractHostname(url) == "netmozi.com" && document.getElementById("beallitas2").checked == true) {

    if (url.indexOf("//") > -1) {
        linke = url.split('/').slice(0, 6).join('/')+ "/s" + evad + "/e" + resz;
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
// function reszek(id, osszes) {
//
//
//   let rawdata = fs.readFileSync(tarolo);
//   let obj = JSON.parse(rawdata);
//   let nev, evad, evadperresz, resz, archiv, ut, mas, elottiev, elottiresz;
//
//
//   for (var i = 0; i < obj.data.length; i++) {
//     mas = obj.data[i].Other;
//     evadperresz = obj.data[i].Episodeyear;
//
//     if (mas == id) {
//       console.log("itt vagyok");
//       obj.data[i].Episodeyear = osszes;
//       fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
//
//     }
//   }
// } //reszek vege


var boxes = document.querySelectorAll("input[type='checkbox']");

for (var i = 0; i < boxes.length; i++) {
  var box = boxes[i];
  if (box.hasAttribute("store")) {
    setupBox(box);
  }
}

show(1);
