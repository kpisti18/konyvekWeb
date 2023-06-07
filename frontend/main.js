//let = rövid távú memória
//var = hosszú távú memória, de csak az értéket tárolja
//const = hosszú távú memória (ez jobb mint a var, és blokkon kívülre is írható)

// --milyen objektumokkal dolgozunk: kiszervezzük a változókat "globálissá", hogy bárhol tudjuk használni őket
const baseUrl = 'http://localhost:3000/vasarlok';
const inputNev = document.querySelector('#nev');
const inputEmail = document.querySelector('#email');
const inputFelhasznalonev = document.querySelector('#felhasznalonev');
const inputJelszo = document.querySelector('#jelszo1');
const inputId = document.querySelector('#vasarloId');
const btnCreate = document.querySelector('#buttonCreate');
const btnReadAll = document.querySelector('#buttonReadAll');
const btnDelete = document.querySelector('#buttonDelete');
const btnUpdate = document.querySelector('#buttonUpdate');

// --események
//összes adat kiolvasása
btnReadAll.addEventListener('click', readAllVasarlo);
async function readAllVasarlo() {
    const response = await fetch(`${baseUrl}/readAll`);
    const jsonData = await response.json();
    //console.log(jsonData);
    kartyakMegjelenitese(jsonData);
}

//kártyák megjelenítése
function kartyakMegjelenitese(jsonData) {
    beviteliMezokNullazasa();
    osszesVasarlo.innerHTML = '';

    for (let i = jsonData.length - 1; i >= 0; i--) {
        const osszesVasarlo = document.getElementById('osszesVasarlo');
        const vasarlo = jsonData[i];

        const egyVasarloKartya = document.createElement('div');
        egyVasarloKartya.className = 'card m-3';

        let card = `
            <div class="card-body">
                <h5 class="card-title">${vasarlo.nev}</h5>
                <p class="card-text">${vasarlo.email_cim}</p>
                <p class="card-text">${vasarlo.felhasznalonev}</p>
                <p class="card-text">id: ${vasarlo.vasarloid}</p>
                <a href="#" class="btn btn-primary" onclick="vasarloKivalasztasa(${vasarlo.vasarloid});" id="vasarlo${vasarlo.vasarloid}">Kiválaszt</a>
            </div>        
        `;

        egyVasarloKartya.innerHTML = card;
        osszesVasarlo.appendChild(egyVasarloKartya);
    }
}

//vásárló kiválasztása
async function vasarloKivalasztasa(id) {
    const response = await fetch(`${baseUrl}/select/${id}`);
    const jsonData = await response.json();
    let selectedCustomer = jsonData[0];
    kivalasztottVasarloMegjelenitese(selectedCustomer);
    //console.log(selectedCustomer);
}

//kiválasztott vásárló megjelenítése
//mivel globálisak az id-k változói, így nem lesz gond az értékek kinyerésével
function kivalasztottVasarloMegjelenitese(params) {
    inputId.value = params.vasarloid;
    inputNev.value = params.nev;
    inputEmail.value = params.email_cim;
    inputFelhasznalonev.value = params.felhasznalonev;
}

//új létrehozása
btnCreate.addEventListener('click', createVasarlo);
async function createVasarlo() {
    let jelsz1 = document.getElementById("jelszo1").value;
    let jelsz2 = document.getElementById("jelszo2").value;

    if (egyezoJelszo(jelsz1, jelsz2) && mindenKiVanToltve()) {
        let data = {
            nev: document.getElementById("nev").value,
            email_cim: document.getElementById("email").value,
            felhasznalonev: document.getElementById("felhasznalonev").value,
            jelszo: jelsz1
        };
        beviteliMezokNullazasa();
        readAllCustomers();

        try {
            const response = await fetch(`${baseUrl}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(result);

        } catch (error) {
            console.error("Hiba:", error);
        }
    }
}

//input mezők nullázása
function beviteliMezokNullazasa() {
    inputId.value = "";
    inputNev.value = "";
    inputEmail.value = "";
    inputFelhasznalonev.value = "";
    inputJelszo.value = "";
    document.getElementById("jelszo2").value = "";
}

//törlés
btnDelete.addEventListener('click', deleteVasarlo);
async function deleteVasarlo() {
    let url = `${baseUrl}/delete/${inputId.value}`;
    data = {
        nev: inputNev.value,
        email_cim: inputEmail.value,
        felhasznalonev: inputFelhasznalonev.value,
        vasarloid: inputId.value
    } 

    const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
    beviteliMezokNullazasa();
};

//update
btnUpdate.addEventListener('click', updateVasarlo);
async function updateVasarlo() {
    let url = `${baseUrl}/update/${inputId.value}`;
    data = {
        nev: inputNev.value,
        email_cim: inputEmail.value,
        felhasznalonev: inputFelhasznalonev.value,
        vasarloid: inputId.value
    } 
    console.log(data);
    const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
    beviteliMezokNullazasa();
};