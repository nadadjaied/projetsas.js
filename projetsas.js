const prompt = require('prompt-sync')();
let candidats = [];
let choix;

console.log(`
========================================
 GESTION DES ÉLECTIONS - MENU PRINCIPAL
========================================
1. Ajouter un nouveau candidat
2. Ajouter plusieurs candidats à la fois
3. Afficher la liste des candidats
4. Voter pour un candidat
5. Modifier les informations d'un candidat
6. Supprimer un candidat
7. Rechercher un candidat par nom
8. Afficher les statistiques de l'élection
9. Quitter
========================================`);

do {
    choix = prompt('Votre choix :');
    switch (choix) {
        case '1':
            ajouterCandidat();
            break;
        case '2':
            ajouterPlusieursCandidats();
            break;
        case '3':
            afficherListeCandidat();
            break;
        case '4':
            voterPourCandidat();
            break;
        case '5':
            modifierCandidat();
            break;
        case '6':
            supprimerCandidat();
            break;
        case '7':
            rechercherCandidat();
            break;
        case '8':
            afficherLesStatistiques();
            break;
        case '9':
            console.log('Au revoir !');
            break;
        default:
            console.log('Choix invalide, réessayez.');
    }
} while (choix !== '9');

function trouverIndexParCin(cin) {
    for (let i = 0; i < candidats.length; i++) {
        if (candidats[i].cin === cin) {
            return i;
        }
    }
    return -1;
}

function afficherUnCandidat(candidat) {
    console.log(
        "CIN : " + candidat.cin +
        " | Nom : " + candidat.nom +
        " | Prénom : " + candidat.prenom +
        " | Parti : " + candidat.partiPolitique +
        " | Âge : " + candidat.age +
        " | Votes : " + candidat.electeurs.length
    );
}

function ajouterCandidat() {
    let cin = prompt("Donner le CIN :");
    for (let candidat of candidats) {
        if (candidat.cin === cin) {
            console.log("Ce CIN existe déjà !");
            return;
        }
    }
    let nom = prompt("Donner le nom :");
    let prenom = prompt("Donner le prénom :");
    let partiPolitique = prompt("Donner le parti politique :");
    if (partiPolitique === "") {
        partiPolitique = "Indépendant";
    }
    let age = Number(prompt("Donner l'âge :"));
    let candidat = {
        cin: cin,
        nom: nom,
        prenom: prenom,
        partiPolitique: partiPolitique,
        age: age,
        electeurs: []
    };
    candidats.push(candidat);
    console.log("Candidat ajouté avec succès !");
}

function ajouterPlusieursCandidats() {
    let nombre = Number(prompt("Combien de candidats voulez-vous ajouter ?"));
    for (let i = 0; i < nombre; i++) {
        ajouterCandidat();
    }
}

function triparvotes() {
    for (let i = 0; i < candidats.length; i++) {
        for (let j = 0; j < candidats.length - 1 - i; j++) {
            if (candidats[j].electeurs.length < candidats[j + 1].electeurs.length) {
                let temp = candidats[j + 1];
                candidats[j + 1] = candidats[j];
                candidats[j] = temp;
            }
        }
    }
}

function afficherListeCandidat() {
    if (candidats.length === 0) {
        console.log("Aucun candidat à afficher.");
        return;
    }
    console.log("[1]. Affichage par ordre de vote");
    console.log("[2]. Affichage par parti politique");
    console.log("[3]. Afficher tous les candidats");
    const choixAffichage = Number(prompt("Pick one number : "));
    switch (choixAffichage) {
        case 1:
            triparvotes();
            for (let i = 0; i < candidats.length; i++) {
                afficherUnCandidat(candidats[i]);
            }
            break;
        case 2:
            let parti = prompt("Quel parti politique voulez-vous afficher ? ");
            let aucunTrouve = true;
            for (let i = 0; i < candidats.length; i++) {
                if (candidats[i].partiPolitique === parti) {
                    afficherUnCandidat(candidats[i]);
                    aucunTrouve = false;
                }
            }
            if (aucunTrouve) {
                console.log("Aucun candidat trouvé pour ce parti.");
            }
            break;
        case 3:
            for (let i = 0; i < candidats.length; i++) {
                afficherUnCandidat(candidats[i]);
            }
            break;
        default:
            console.log("Choix invalide.");
    }
}

function voterPourCandidat() {
    let cinElecteur = prompt("Veuillez saisir votre CIN :");
    let aDejaVote = false;
    for (let i = 0; i < candidats.length; i++) {
        for (let j = 0; j < candidats[i].electeurs.length; j++) {
            if (candidats[i].electeurs[j] === cinElecteur) {
                aDejaVote = true;
            }
        }
    }
    if (aDejaVote) {
        console.log("Vous avez déjà voté et vous n'avez pas le droit de modifier votre vote ni de voter à nouveau");
        return;
    }
    let cinCandidat = prompt("Entrez l'identifiant (CIN) du candidat pour lequel vous voulez voter :");
    let index = trouverIndexParCin(cinCandidat);
    if (index === -1) {
        console.log("Candidat introuvable avec cet identifiant.");
        return;
    }
    candidats[index].electeurs.push(cinElecteur);
    console.log("Votre vote a été enregistré avec succès !");
}

function modifierCandidat() {
    let cin = prompt("CIN du candidat à modifier :");
    let index = trouverIndexParCin(cin);
    if (index === -1) {
        console.log("Candidat introuvable avec cet identifiant.");
        return;
    }
    console.log("[1]. Modifier le parti politique");
    console.log("[2]. Modifier l'âge");
    let choixModif = prompt("Votre choix :");
    if (choixModif === '1') {
        let nouveauParti = prompt("Nouveau parti politique :");
        candidats[index].partiPolitique = nouveauParti;
        console.log("Parti politique modifié avec succès !");
    } else if (choixModif === '2') {
        let nouvelAge = Number(prompt("Nouvel âge :"));
        candidats[index].age = nouvelAge;
        console.log("Âge modifié avec succès !");
    } else {
        console.log("Choix invalide.");
    }
}

function supprimerCandidat() {
    let cin = prompt("CIN du candidat à supprimer :");
    let index = trouverIndexParCin(cin);
    if (index === -1) {
        console.log("Candidat introuvable avec cet identifiant.");
        return;
    }
    let nouvelleListe = [];
    for (let i = 0; i < candidats.length; i++) {
        if (i !== index) {
            nouvelleListe.push(candidats[i]);
        }
    }
    candidats = nouvelleListe;
    console.log("Candidat supprimé avec succès !");
}

function rechercherCandidat() {
    let nomRecherche = prompt("Nom du candidat à rechercher :");
    let trouve = false;
    for (let i = 0; i < candidats.length; i++) {
        if (candidats[i].nom === nomRecherche) {
            afficherUnCandidat(candidats[i]);
            trouve = true;
        }
    }
    if (!trouve) {
        console.log("Aucun candidat trouvé avec ce nom.");
    }
}

function afficherLesStatistiques() {
    console.log("Nombre total de candidats : " + candidats.length);

    let totalVotes = 0;
    for (let i = 0; i < candidats.length; i++) {
        totalVotes = totalVotes + candidats[i].electeurs.length;
    }
    console.log("Nombre total de votes exprimés : " + totalVotes);

    console.log("Top 3 des candidats :");
    triparvotes();
    let limite = 3;
    if (candidats.length < 3) {
        limite = candidats.length;
    }
    for (let i = 0; i < limite; i++) {
        afficherUnCandidat(candidats[i]);
    }

    console.log("Nombre de candidats par parti politique :");
    let partis = [];
    let compteurs = [];
    for (let i = 0; i < candidats.length; i++) {
        let parti = candidats[i].partiPolitique;
        let indexParti = -1;
        for (let j = 0; j < partis.length; j++) {
            if (partis[j] === parti) {
                indexParti = j;
            }
        }
        if (indexParti === -1) {
            partis.push(parti);
            compteurs.push(1);
        } else {
            compteurs[indexParti] = compteurs[indexParti] + 1;
        }
    }
    for (let i = 0; i < partis.length; i++) {
        console.log(partis[i] + " : " + compteurs[i]);
    }
}