let podaci = []; //ovaj niz koristimo za cuvanje podataka koje dobijemo sa servisa
let smjerSortiranjaASC = 1; //odredjuje smijer sortiranja. kada se klikne na header tabele smijer se mijenja, a podaci se sortiraju

/*
    ova funkcija ce samo preuzimati podatke sa web servisa i cuvati ih u promjenljivoj podaci
    da bi nam bilo lakse prikazati i sortirati podatke, iz dobijenog niza cemo sacuvati samo one podatke koji nam trebaju
*/
function preuzmiPodatke(sezona) {

    document.getElementById("rezultati").innerHTML = "";
    if (sezona == null || sezona == "") {
        return;
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var json = JSON.parse(request.responseText);
            //json su originalni podaci dobijeni sa servera
            //sada cemo iz originalnog niza zadrzati samo neka polja (map funkcija ce nam vratiti nove objekte na osnovu originalnih)
            podaci = json.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(element => {
                return { //ovo je novi objekat koji cuvamo lokalno. Nazive atributa dajemo sami
                    nacija: element.Driver.nationality,
                    ime: element.Driver.givenName,
                    prezime: element.Driver.familyName,
                    bodovi: Number(element.points),
                    konstruktor: element.Constructors[0].name,
                    link: element.Driver.url
                };
            });
            //kada se ucitaju podaci sa web servisa mozemo ih iscrtati u tabeli
            popuniTabelu();
        }
    };
    request.open("GET", "http://ergast.com/api/f1/" + sezona + "/driverStandings.json");
    request.send();
}

function popuniSezone() {
    for (var i = 1960; i <= 2019; i++) {
        document.getElementById("select").innerHTML += "<option value="
            + i + ">" + i + "</option>"
    }
}

function pronadjiZastavu(nacija) {
    let zastave = {
        "British": "britain.png",
        "German": "germany.png"
        //TODO: za ostale...
    }
    return zastave[nacija] || "default.png"; //ako drzava nije poznata vrati osnovnu sliku. Ovo rjesava undefined gresku na konzoli
}


function sortiraj(kolona) {
    //ovo radi ako posaljemo naziv atributa objekata iz niza podaci. Kolona je ime jednog atributa
    podaci.sort(function (a, b) {
        if (a[kolona] > b[kolona]) {
            return smjerSortiranjaASC; //inace vracamo 1. Ako je smjerSortiranjaASC 1, onda isto radi. Za obrnut smjer nam treba -1
        }
        if (a[kolona] < b[kolona]) {
            return -1 * smjerSortiranjaASC; //-1*1 = -1; -1*-1 = 1; Znaci da nam ovo -1 * ... omogucava promjenu smjera sortiranja
        }
        return 0;
    });
    smjerSortiranjaASC = -1 * smjerSortiranjaASC; //promjena smijera sortiranja
    popuniTabelu(); //posto je niz podaci sortiran, trebamo ponovo iscrtati tabelu
}

function popuniTabelu() {
    let tabela = document.getElementById("rezultati");
    tabela.innerHTML = "";

    podaci.forEach((element, index) => {
        let red = tabela.insertRow(index);
        let drzava = red.insertCell(0);
        let ime = red.insertCell(1);
        let prezime = red.insertCell(2);
        let bodovi = red.insertCell(3);
        let konstruktor = red.insertCell(4);
        let link = red.insertCell(5);

        drzava.innerHTML = "<img height=\"40\" src=\"" + pronadjiZastavu(element.nacija) + "\"/> ";
        ime.innerHTML = element.ime;
        prezime.innerHTML = element.prezime;
        bodovi.innerHTML = element.bodovi;
        konstruktor.innerHTML = element.konstruktor;
        link.innerHTML = "<a href=\"" + element.link + "\" target=\"_blank\">Vise</a>";
    });
}