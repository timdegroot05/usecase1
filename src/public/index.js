const burger = document.querySelector('#burger');
const menu = document.querySelector('#menu')

burger.addEventListener('click', () => {
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
})

// Data structure
let laptops = [
    {
        id: 1,
        naam: "ThinkPad X1",
        eigenschappen: [
            { id: 1, naam: "CPU", waarde: "Intel i7-1165G7" },
            { id: 2, naam: "GPU", waarde: "Intel Iris Xe" }
        ]
    }
];

let geselecteerdeLaptop = laptops[0];
let bewerkEigenschap = null;
let teVerwijderenEigenschap = null;

// DOM Elements
const eigenschappenTabel = document.getElementById('eigenschappenTabel');
const eigenschapForm = document.getElementById('eigenschapForm');
const formTitel = document.getElementById('formTitel');
const eigenschapNaam = document.getElementById('eigenschapNaam');
const eigenschapWaarde = document.getElementById('eigenschapWaarde');
const foutmelding = document.getElementById('foutmelding');
const foutmeldingTekst = document.getElementById('foutmeldingTekst');
const succesmelding = document.getElementById('succesmelding');
const succesmeldingTekst = document.getElementById('succesmeldingTekst');
const bevestigModal = document.getElementById('bevestigModal');
const verwijderModal = document.getElementById('verwijderModal');

// Functions
function updateEigenschappenTabel() {
    eigenschappenTabel.innerHTML = geselecteerdeLaptop.eigenschappen.map(eigenschap => `
        <tr class="border-b">
            <td class="py-2">${eigenschap.naam}</td>
            <td class="py-2">${eigenschap.waarde}</td>
            <td class="py-2 flex gap-2">
                <button
                    onclick="handleEigenschapBewerken(${eigenschap.id})"
                    class="text-blue-500 hover:text-blue-700"
                >
                    Bewerken
                </button>
                <button
                    onclick="handleVerwijderen(${eigenschap.id})"
                    class="text-red-500 hover:text-red-700"
                >
                    Verwijderen
                </button>
            </td>
        </tr>
    `).join('');
}

function handleEigenschapBewerken(id) {
    bewerkEigenschap = geselecteerdeLaptop.eigenschappen.find(e => e.id === id);
    eigenschapNaam.value = bewerkEigenschap.naam;
    eigenschapWaarde.value = bewerkEigenschap.waarde;
    formTitel.textContent = 'Eigenschap bewerken';
    eigenschapForm.classList.remove('hidden');
    foutmelding.classList.add('hidden');
}

function handleNieuweEigenschap() {
    bewerkEigenschap = null;
    eigenschapNaam.value = '';
    eigenschapWaarde.value = '';
    formTitel.textContent = 'Nieuwe eigenschap';
    eigenschapForm.classList.remove('hidden');
    foutmelding.classList.add('hidden');
}

function validateEigenschap() {
    if (!eigenschapNaam.value || !eigenschapWaarde.value) {
        toonFoutmelding("Ongeldige invoer. Controleer de gegevens en probeer opnieuw.");
        return false;
    }

    const bestaandeEigenschap = geselecteerdeLaptop.eigenschappen.find(
        e => e.naam === eigenschapNaam.value && (!bewerkEigenschap || e.id !== bewerkEigenschap.id)
    );

    if (bestaandeEigenschap) {
        toonFoutmelding("Een eigenschap met deze naam bestaat al voor deze laptop. Kies een andere naam.");
        return false;
    }

    return true;
}

function handleOpslaan() {
    if (!validateEigenschap()) return;
    bevestigModal.classList.remove('hidden');
}

function handleBevestig() {
    if (bewerkEigenschap) {
        bewerkEigenschap.naam = eigenschapNaam.value;
        bewerkEigenschap.waarde = eigenschapWaarde.value;
    } else {
        const nieuweId = Math.max(0, ...geselecteerdeLaptop.eigenschappen.map(e => e.id)) + 1;
        geselecteerdeLaptop.eigenschappen.push({
            id: nieuweId,
            naam: eigenschapNaam.value,
            waarde: eigenschapWaarde.value
        });
    }

    updateEigenschappenTabel();
    bevestigModal.classList.add('hidden');
    eigenschapForm.classList.add('hidden');
    toonSuccesmelding("De eigenschap is succesvol toegevoegd/aangepast.");
}

function handleAnnuleren() {
    bevestigModal.classList.add('hidden');
    toonFoutmelding("Wijzigingen zijn niet opgeslagen.");
}

function handleVerwijderen(id) {
    teVerwijderenEigenschap = geselecteerdeLaptop.eigenschappen.find(e => e.id === id);
    verwijderModal.classList.remove('hidden');
}

function handleVerwijderBevestig() {
    geselecteerdeLaptop.eigenschappen = geselecteerdeLaptop.eigenschappen.filter(
        e => e.id !== teVerwijderenEigenschap.id
    );
    updateEigenschappenTabel();
    verwijderModal.classList.add('hidden');
    toonSuccesmelding("De eigenschap is succesvol verwijderd.");
    teVerwijderenEigenschap = null;
}

function handleVerwijderAnnuleren() {
    verwijderModal.classList.add('hidden');
    teVerwijderenEigenschap = null;
}

function toonFoutmelding(tekst) {
    foutmeldingTekst.textContent = tekst;
    foutmelding.classList.remove('hidden');
}

function toonSuccesmelding(tekst) {
    succesmeldingTekst.textContent = tekst;
    succesmelding.classList.remove('hidden');
    setTimeout(() => succesmelding.classList.add('hidden'), 3000);
}

// Initialize
updateEigenschappenTabel();


// Dit is voor de pagina adviezen
let huidigeAanvraag = null;

const extraInformatieContent = {
    Gaming: `
        <h4 class="font-medium mb-2">Aandachtspunten voor Gaming Laptops:</h4>
        <ul class="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Controleer of de GPU geschikt is voor de gewenste games</li>
            <li>Let op de verversingssnelheid van het scherm</li>
            <li>Controleer de koelingsmogelijkheden</li>
            <li>Kijk naar uitbreidingsmogelijkheden voor RAM en opslag</li>
        </ul>
    `,
    Videobewerking: `
        <h4 class="font-medium mb-2">Aandachtspunten voor Videobewerking Laptops:</h4>
        <ul class="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Controleer of de CPU geschikt is voor videomontage</li>
            <li>Let op de kleurnauwkeurigheid van het scherm</li>
            <li>Kijk naar de beschikbare poorten voor externe apparatuur</li>
            <li>Controleer de opslagcapaciteit en -snelheid</li>
        </ul>
    `
};

function selecteerAanvraag(element, id, titel, type, budget, wensen) {
    huidigeAanvraag = { element, id, titel, type, budget, wensen };
    
    // Toon het adviesformulier
    document.getElementById('adviesForm').classList.remove('hidden');
    
    // Update de klantinformatie
    document.getElementById('gebruiksdoel').textContent = type;
    document.getElementById('budget').textContent = budget;
    document.getElementById('wensen').textContent = wensen;

    // Update de extra informatie sectie
    const extraInformatieDiv = document.getElementById('extraInformatie').querySelector('.bg-yellow-50');
    extraInformatieDiv.innerHTML = extraInformatieContent[type] || extraInformatieContent.Gaming;

    // Scroll naar het formulier
    document.getElementById('adviesForm').scrollIntoView({ behavior: 'smooth' });
}

function handleAdviesVersturen() {
    const adviesTekst = document.getElementById('adviesTekst').value;
    if (!adviesTekst.trim()) {
        toonFoutmelding('Vul eerst een advies in voordat u het verstuurt.');
        return;
    }

    // Verplaats de aanvraag naar verstuurde adviezen
    const verstuurdeAdviezenContainer = document.getElementById('verstuurdeAdviezen');
    const aanvraagElement = huidigeAanvraag.element.cloneNode(true);
    
    // Verwijder de onclick handler en cursor-pointer class
    aanvraagElement.onclick = null;
    aanvraagElement.classList.remove('cursor-pointer', 'hover:bg-gray-50');
    
    // Voeg het advies toe aan het element
    const adviesDiv = document.createElement('div');
    adviesDiv.className = 'mt-4 p-3 bg-gray-50 rounded-lg';
    adviesDiv.innerHTML = `
        <p class="text-sm font-medium text-gray-700 mb-1">Gegeven advies:</p>
        <p class="text-sm text-gray-600">${adviesTekst}</p>
    `;
    aanvraagElement.appendChild(adviesDiv);
    
    // Voeg een timestamp toe voor wanneer het advies is verstuurd
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'mt-2 text-sm text-gray-500';
    timestampDiv.textContent = `Advies verstuurd: ${new Date().toLocaleTimeString()}`;
    aanvraagElement.appendChild(timestampDiv);
    
    // Voeg het element toe aan de verstuurde adviezen sectie
    verstuurdeAdviezenContainer.insertBefore(aanvraagElement, verstuurdeAdviezenContainer.firstChild);
    
    // Verwijder de originele aanvraag
    huidigeAanvraag.element.remove();
    
    // Reset het formulier
    document.getElementById('adviesTekst').value = '';
    document.getElementById('adviesForm').classList.add('hidden');
    
    // Toon succesmelding
    toonSuccesmelding('Advies succesvol verstuurd naar de klant.');
    
    // Reset huidige aanvraag
    huidigeAanvraag = null;
}

function handleAnnuleren() {
    document.getElementById('adviesTekst').value = '';
    document.getElementById('adviesForm').classList.add('hidden');
    huidigeAanvraag = null;
    toonFoutmelding('Adviesaanvraag geannuleerd');
}

function toonSuccesmelding(tekst) {
    const succesmelding = document.getElementById('succesmelding');
    const succesmeldingTekst = document.getElementById('succesmeldingTekst');
    succesmeldingTekst.textContent = tekst;
    succesmelding.classList.remove('hidden');
    setTimeout(() => succesmelding.classList.add('hidden'), 3000);
}

function toonFoutmelding(tekst) {
    const foutmelding = document.getElementById('foutmelding');
    const foutmeldingTekst = document.getElementById('foutmeldingTekst');
    foutmeldingTekst.textContent = tekst;
    foutmelding.classList.remove('hidden');
    setTimeout(() => foutmelding.classList.add('hidden'), 3000);
}



