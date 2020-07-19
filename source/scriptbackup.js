const nwGui = require('nw.gui');
const path = require('path');
const fs = require('fs');
const os = require('os');
const readdirp = require('readdirp');

const tarolo = "source/tarolo.json";

const beproba = {
  miszerint: 'Name',
  settingshelyzet: true,
  kesletetes: 3600000 * 8 //8ora
}



const computerName = os.hostname();


function nyit(mit) {
  var open = require("open");
  if (mit != null) {
    open(mit);
  }

}

function selectFolder(e) {
  var theFiles = e.target.files;
  var relativePath = theFiles[0].path;

  let kivagni = theFiles[0].webkitRelativePath;
  let kivagnielso = kivagni.split("/");
  var folder = relativePath.split(kivagni);
  let osszerakva = folder[0] + kivagnielso[0];
  //  console.log(kivagni);
  //console.log(folder);
  document.getElementById("ujhely").value = osszerakva;

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

  people = sortByKey(obj.data, beproba.miszerint); //sorbarakás abc

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
      new_kep.setAttribute("id", mas + "2");
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
      //  gomb_ketto.addEventListener ("click", nyit(ut));

      var gomb_harom = document.createElement('input');
      gomb_harom.setAttribute("type", "button");
      gomb_harom.setAttribute("target", "ujel");
      // gomb_harom.setAttribute("title", "ujel");
      gomb_harom.id = nev;
      gomb_harom.setAttribute("onclick", 'megNez(\'' + nev + '\',1)');
      let noveltt = parseInt(resz, 10) + 1;
      gomb_harom.setAttribute("onmouseover", 'mappatartalom(\'' + ut + '\',\'' + evad + '\',\'' + noveltt + '\',1,\'' + nev + '\')');
      //gomb_harom.setAttribute("onmouseover", 'kovetlezoresz(\'' + nev + '\')');
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
  } //for ege
  if (document.getElementById("beallitas4").checked == true) {
    shower(melyiket);
  }
}

function uzenetek(mituzensz) {
  document.getElementById("fontosuzi").innerHTML = "";
  document.getElementById("fontosuzi").style.display = "block";
  document.getElementById("fontosuzi").innerHTML = mituzensz;


  setTimeout(function() {
    document.getElementById('fontosuzi').style.display = 'none'
  }, 5000);

}

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
          // console.log(res);

          minden.push(fullPath);

          jo = fullPath;
          //  console.log(minden, jo);
          if (opcio === 1) {
            uzenetek(output);
            //document.getElementById(nev).title += ": " + output;
          //  console.log(output);
          } else {
            nyit(minden[0]);
          }

        }


      })
    // console.log(minden, jo);
  }


}


async function newe() {
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
    try {
      fs.writeFileSync(tarolo, JSON.stringify(json, null, 2));

    } catch (e) {
      uzenetek(e);
    } finally {
      uzenetek("A művelet sikeres!");

    }

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

  document.getElementById("FileUpload").value = '';

  document.getElementById("szepislesz").click();

}

function modositas(evadas, reszadas, maxadas, helyadas, nevadas, arhiva, masska) {
  backupfunk();
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

      var deletedItem = obj.data.splice(i, 1);

      fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
    }
  } //for ege
  //jsonfelhoir();
}
async function megNez(kapott_nev, opcio) {
  backupfunk();


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
          uzenetek("Elrejtve!");
        }
        // else {
        //   await mennyiresz(mas, evad);
        // }

        fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
        resz = evadperresz;
        evad--;
      } else {
        obj.data[i].Episode = resz + 1;
        resz++;
        fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
      }
      if (ValidURL(ut) == false && document.getElementById("beallitas1").checked) {
        mappatartalom(ut, evad, resz, 0, kapott_nev);
      } else if (ValidURL(ut) && document.getElementById("beallitas1").checked) {
        webnezo(ut, evad, resz);
      }
      //await reszek(id, osszes) ;
      await mennyiresz(mas, evad, 2);
    } // eddig egyenlo a ketto nev




  } //for ege

  document.getElementById("szepislesz").click();
  tvdbobjekletolt(mas);
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

function reszek(id, osszes) {


  let rawdata = fs.readFileSync(tarolo);
  let obj = JSON.parse(rawdata);
  let nev, evad, evadperresz, resz, archiv, ut, mas, elottiev, elottiresz;


  for (var i = 0; i < obj.data.length; i++) {
    mas = obj.data[i].Other;
    evadperresz = obj.data[i].Episodeyear;

    if (mas == id) {
      //    console.log("itt vagyok");
      obj.data[i].Episodeyear = parseInt(osszes, 10);
      try {
        fs.writeFileSync(tarolo, JSON.stringify(obj, null, 2));
      } catch (e) {
        uzenetek(e);
      } finally {
        //  uzenetek("MAx resz friiss");
      }


    }
  }
} //reszek vege


var boxes = document.querySelectorAll("input[type='checkbox']");

for (var i = 0; i < boxes.length; i++) {
  var box = boxes[i];
  if (box.hasAttribute("store")) {
    setupBox(box);
  }
}

show(1);


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myF() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function backupfunk() {
  const backup = 'source/data/backup/' + Date.now() + '.json';
  fs.copyFile(tarolo, backup, (err) => {
    if (err) throw err;
  });
}

  window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
      var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }
