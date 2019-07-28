var cadre = document.getElementById("cadre");
var alphabetBox = document.getElementById("alphabet");

// Création d'un tableau avec tous les mots
var tousMots = [];

// Création d'un premier mot
var cheval = {
    intitule: "Cheval",
    def: "Mammifère herbivore de grande taille, à un seul doigt par membre, coureur rapide des steppes et prairies, dont la domestication a joué un grand rôle dans l'essor des civilisations asiatiques et européennes.",
    synonyme: "dada bidet bique carne poney rosse cavale étalon hunter jument bourrin coureur mustang canasson coursier destrier haquenée palefroi pouliche yearling bourrique haridelle récidiviste rossinante",
    quote: "C'est l'oeil du maître qui fait engraisser le cheval.",
    citationAuteur: "Plutarque",
    cnrtl: "https://www.cnrtl.fr/definition/cheval",
    nbUtilisation: 0,
    nbQuizz: 0,
    nbSucces:0
}

// Création d'un second mot sur le même format
var mouton = Object.create(cheval);
mouton.intitule = "Mouton";

// Ajout de ces deux mots par défaut au tableau
tousMots.push(cheval);
tousMots.push(mouton);

// Compteur du nb d'utilisation du mot (ne marche pas :-( )
/*for (mot of tousMots) {
    var boutonUtilisation = document.createElement("button");
    // boutonUtilisation.id = mot.intitule + "BtUt";
    boutonUtilisation.textContent = "Je l'ai utilisé !";
    boutonUtilisation.addEventListener("click", function() {
        mot.nbUtilisation+=1;
    })
    var motUtilisation = document.createElement("i");
    motUtilisation.style.marginRight = "20px";
    motUtilisation.textContent = "Utilisé " + mot.nbUtilisation + " fois.";
}*/


// Fonction pour afficher un mot dans la div Cadre
function afficherMot (mot) {
    let motBox = document.createElement("div");

    let motIntitule = document.createElement("h4");
    motIntitule.style.fontSize = "20px";
    motIntitule.style.marginTop = "30px";
    motIntitule.textContent = mot.intitule;

    let motDef = document.createElement("p");
    motDef.textContent = mot.def;

    let motSynonyme = document.createElement("p");
    motSynonyme.style.fontSize = "80%";
    motSynonyme.textContent = "Synonymes : " + mot.synonyme;

    let motCitation = document.createElement("p");
    motCitation.style.fontStyle = "italic";
    motCitation.style.color = "blue";
    motCitation.textContent = mot.quote;
    let motCitationAuteur = document.createElement("span");
    motCitationAuteur.style.color = "black";
    motCitationAuteur.textContent = "   -   " + mot.citationAuteur;
    motCitation.appendChild(motCitationAuteur);

    let motCnrtl = document.createElement("a");
    motCnrtl.textContent = "Plus d'infos sur le CNRTL";
    motCnrtl.href = mot.cnrtl;

    let utilisationBox = document.createElement("p");
    var boutonUtilisation = document.createElement("button");
    boutonUtilisation.id = mot.intitule + "BtUt";
    boutonUtilisation.textContent = "Je l'ai utilisé !";
    let motUtilisation = document.createElement("i");
    motUtilisation.style.marginRight = "20px";
    motUtilisation.textContent = "Utilisé " + mot.nbUtilisation + " fois.";
    utilisationBox.appendChild(motUtilisation);
    utilisationBox.appendChild(boutonUtilisation);

    let motQuizz = document.createElement("p");
    motQuizz.textContent = "Score Quizz : " + mot.nbSucces + "/" + mot.nbQuizz;

    let separateur = document.createElement("hr");
    separateur.style.marginBottom = "20px";
    separateur.style.border = "2px solid";

    motBox.appendChild(motIntitule);
    motBox.appendChild(motDef);
    motBox.appendChild(motSynonyme);
    motBox.appendChild(motCitation);
    motBox.appendChild(motCnrtl);
    motBox.appendChild(utilisationBox);
    motBox.appendChild(motQuizz);
    motBox.appendChild(separateur);
    cadre.appendChild(motBox);
}


// Fonction pour afficher tous les mots commençant par une lettre donnée
function afficherMotsParLettre (lettre) {
    cadre.innerHTML="";
    // On crée un sous-tableau filtré à partir du premier en fonction de la première lettre de chaque mot
    var filtreTousMots = [];
    tousMots.forEach(mot => {
        if (mot.intitule[0] === lettre) {
            filtreTousMots.push(mot);
        };
    })
    // On affiche un message d'erreur temporaire si rien n'a été trouvé
    if (filtreTousMots.length === 0) {
        var msgElt = document.createElement("p");
        msgElt.textContent = "Aucun mot trouvé pour " + lettre;
        cadre.appendChild(msgElt);
        setTimeout(function() {
            cadre.removeChild(msgElt);
        }, 3000)
    } else {
        // On affiche les mots trouvés
        filtreTousMots.forEach( mot => {
            afficherMot(mot);
        })
    }
}

// Création du menu de filtre par lettre
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for (let i=0; i<alphabet.length; i++) {
    let lettreElt = document.createElement("a");
    lettreElt.textContent = alphabet[i];
    lettreElt.href = "#";
    alphabetBox.appendChild(lettreElt);
    alphabetBox.appendChild(document.createTextNode(" | "));
    lettreElt.addEventListener("click", function() {
        afficherMotsParLettre(alphabet[i].toString())
    });
}

// Ajout d'une option pour afficher tous les mots du carnet
alphabetBox.appendChild(document.createTextNode(" | "));
var tous = document.createElement("a");
tous.textContent = "Tous les mots";
tous.href = "#";
alphabetBox.appendChild(tous);

tous.addEventListener("click", function() {
    cadre.innerHTML = "";
    for (mot of tousMots) {
        afficherMot(mot);
    }
})

// Fonction pour ajouter un mot au carnet
function creerMot (motIntitule) {
    // Création d'un nouveau mot-objet sur le modèle du mot par défaut
    var newMot = Object.create(cheval);

    // Utilisation de la fonctionnalité Définition de l'API de DicoLink
    ajaxGet("https://api.dicolink.com/v1/mot/"+motIntitule+"/definitions?limite=1&api_key=-cAXxxeKPkzVOIGc-XMIwAQOkpe-Qdwr", function(reponse) {
        var infoDef = JSON.parse(reponse);
        newMot.intitule = infoDef.mot;
        newMot.def = infoDef.definition;
        // Message de confirmation si cela a bien marché
        var msgConfAjt = document.createElement("p");
        msgConfAjt.textContent = "Le mot \"" + motIntitule + "\" a bien été ajouté à votre carnet.";
        cadre.appendChild(msgConfAjt);
        setTimeout(function() {
            cadre.removeChild(msgConfAjt);
        }, 3000)
    });
    // Ajout de 10 max synonymes du mot à partir de la fonctionnalité Synonymes de l'API DicoLink
    ajaxGet("https://api.dicolink.com/v1/mot/"+motIntitule+"/synonymes?limite=10&api_key=-cAXxxeKPkzVOIGc-XMIwAQOkpe-Qdwr", function(reponse2) {
            infoSyn = JSON.parse(reponse2);
            newMot.synonyme = infoSyn.synonyme;
    });
    //Ajout d'une citation du mot à partir de la fonctionnalité Citations de l'API DicoLink
    ajaxGet("https://api.dicolink.com/v1/mot/"+motIntitule+"/citations?limite=1&api_key=-cAXxxeKPkzVOIGc-XMIwAQOkpe-Qdwr", function(reponse3) {
            infoCit = JSON.parse(reponse3);
            newMot.quote = infoCit.citation;
            newMot.citationAuteur = infoCit.auteur;
    });
    // Ajout du lien CNRTL pour en savoir plus
    newMot.cnrtl = "https://www.cnrtl.fr/definition/"+motIntitule;
    // Définition des valeurs des autres propriétés du nouveau mot
    newMot.nbQuizz = 0;
    newMot.nbSucces = 0;
    newMot.nbUtilisation = 0;
    // Ajout du mot au tableau en première position
    tousMots.unshift(newMot);

}

var form = document.getElementById("formulaire");

// Recherche d'un mot dans le carnet
form.addEventListener("submit", function(e) {
    e.preventDefault();
    cadre.innerHTML="";
    var motCherche = form.elements.recherche.value.toLowerCase();
    for (mot of tousMots) {
        // Si on trouve le mot dans le tableau, on l'affiche
        if (motCherche === mot.intitule.toLowerCase()) {
            afficherMot(mot);
        }
    }
    // Si rien ne s'est affiché, c'est que le mot n'a pas été trouvé. Affichage d'un message. On propose de le rajouter avec un bouton.
    if (cadre.innerHTML==="") {
            var msgNonTrouve = document.createElement("p");
            msgNonTrouve.textContent = "Le mot \"" + motCherche + "\" n'a pas été trouvé dans le carnet. Souhaitez-vous le rajouter ?";
            var boutonAjtMot = document.createElement("button");
            boutonAjtMot.textContent = "Ajouter";
            cadre.appendChild(msgNonTrouve);
            cadre.appendChild(boutonAjtMot);
            // Si clic sur le bouton, on ajoute le mot rentré dans le carnet, et on efface le message et le bouton.
            boutonAjtMot.addEventListener("click", function() {
                creerMot(motCherche);
                cadre.removeChild(msgNonTrouve);
                cadre.removeChild(boutonAjtMot);
            });
        }
    // La barre de recherche est vidée.
    document.getElementById("recherche").value = "";
    });

// Affichage d'un mot aléatoire parmi ceux du carnet à l'accueil sur la page
var motJour = document.createElement("h2");
motJour.textContent = "Le Mot du jour";
motJour.style.textAlign = "center";
motJour.style.textDecoration = "underline";
cadre.insertBefore(motJour, cadre.firstChild);
var random = Math.floor((Math.random())*(tousMots.length));
let motRandom = tousMots[random];
afficherMot(motRandom);

