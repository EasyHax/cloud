const pourcentage = 75;
// les temps min/max pour répondre en seconde
const temps_max = 9;
const temps_min = 6;

window.chironez = function() {
 
  if (_debug.state=="rappel") {
    window.location.href = `/activite/${window._debug.serie_id}/${window._debug.ordre}/chargement/?tempsRestant=2.1&ordre=${window._debug.ordre}&serie_id=${window._debug.serie_id}&solution=${window._debug.solution}&exo_id=${window._debug.exo_id}&state=${window._debug.state}&reponse=${window._debug.solution}`;
  }
  else {

  const trmax = 10 - temps_min;
  const trmin = 10 - temps_max;
    
  let finalSolution = window._debug.solution;
    
  const applyModified = Math.random() < (1 - pourcentage/100);
  const tempsRestant = (Math.random() * (trmax - trmin) + trmin).toFixed(3);
    
  if (applyModified) {
    finalSolution = "1" + finalSolution;
  }

  console.log(tempsRestant);
  console.log(applyModified);
    
  console.log(finalSolution);
  console.log(window._debug.solution);
  window.location.href = `/activite/${window._debug.serie_id}/${window._debug.ordre}/chargement/?tempsRestant=${tempsRestant}&ordre=${window._debug.ordre}&serie_id=${window._debug.serie_id}&solution=${window._debug.solution}&exo_id=${window._debug.exo_id}&state=${window._debug.state}&reponse=${finalSolution}`;
  }
};
 
// Définissez la fonction getCookie pour récupérer le jeton CSRF à partir des cookies du navigateur
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
// Fonction pour convertir les secondes en minutes et secondes sous forme "MM'SS"
function convertirEnMinutesSecondes(tempsEnSecondes) {
  const minutes = Math.floor(tempsEnSecondes / 60);
  const secondes = tempsEnSecondes % 60;
  return `${minutes}'${secondes.toString().padStart(2, '0')}`;
}
 
// Transforme la solution (CCC|DDD) en intervalle de minutes et secondes
function transformerSolution(solution) {
  const [borneMin, borneMax] = solution.split('|').map(Number);  // Convertir les bornes en nombres
  const borneMinFormatee = convertirEnMinutesSecondes(borneMin);
  const borneMaxFormatee = convertirEnMinutesSecondes(borneMax);
  return `${borneMinFormatee}|${borneMaxFormatee}`;
}
 
document.addEventListener('DOMContentLoaded', function() {
 
    const reponseInput = document.getElementById('trait_reponse_user')
    console.log('input:', reponseInput)
    if (reponseInput) {
      reponseInput.focus()
    }
 
 
    // Récupérer les données depuis le modèle HTML
    console.log("Données de série : ", serieData);
    var state = document.getElementById('your-container').getAttribute('data-state');
    let tempsRestant;
 
    const tps_chargement = serieData.temps_restant;
    const nextPageUrl = document.getElementById('nextPageUrl').value;
    // Utilisation du temps spécifié dans la série pour chaque type de page
    const tpsExo = serieData.tps_exo;
    const tpsMemo = serieData.tps_memo;
    const tpsRappel = serieData.tps_rappel;
    const serie_id = serieData.serie_id;
    const ordre = serieData.ordre;
    const exo_id = serieData.exo_id;
    const solution = serieData.solution;
 
    window._debug = {
      reponseInput,
      state,
      tempsRestant,
      tps_chargement,
      nextPageUrl,
      tpsExo,
      tpsMemo,
      tpsRappel,
      serie_id,
      ordre,
      exo_id,
      solution
    };
 
    if (state=="chargement" || state=="memo"){
      window.location.href = nextPageUrl;
    } else {
      chironez();
    }
 
    // Utilisez les données comme nécessaire dans votre JavaScript
    console.log("tps_exo:", serieData.tps_exo);
    console.log("tps_memo:", serieData.tps_memo);
    console.log("tps_rappel:", serieData.tps_rappel);
    console.log("temps_ecart:", serieData.temps_ecart);
    console.log("temps:", serieData.temps);
    console.log("ordre:", serieData.ordre);
    console.log("serie_id:", serieData.serie_id);
 
 
    console.log("Traitement_type:", serieData.Traitement_type);
 
    console.log("state:", state);
 
    const startTimer = (durationInSeconds, nextPageUrl) => {
      const timerDisplay = document.querySelector('.timer');
      let startTime = performance.now();
      let timeLeft = durationInSeconds * 1000; // Convertir en millisecondes
 
      const updateInterval = 1; // Mettez à jour toutes les 1 millisecondes (0,001 seconde)
 
      const updateTimer = () => {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        timeLeft -= elapsedTime;
        tempsRestant = timeLeft/1000;
 
        if (timeLeft <= 0) {
          if (state=="chargement"){
            tempsRestant = 0;
            window.location.href = nextPageUrl;
 
          }
          else{
            if (state === 'traitement' || state === 'rappel') {
              tempsRestant = 0;
              $('#saveResponseButton').trigger("click");  //si quelque chose était écrit mais que enter n'a pas été appuyé, on l'envoie quand même à la fin du timer
            } else {   //pour la mémorisation
              const redirectUrl = `/activite/${serie_id}/${ordre}/chargement/?tempsRestant=${tempsRestant}&ordre=${ordre}&serie_id=${serie_id}&solution=${solution}&exo_id=${exo_id}&state=${state}`;
              window.location.href = redirectUrl;
            }
 
          }
 
        } else {
          // Vérifiez la langue de l'utilisateur, ici en supposant une variable `userLang` pour stocker la langue (par exemple, 'fr' ou 'eng')
          if (userLang === 'eng') {
              timerDisplay.textContent = `Time remaining: ${(timeLeft / 1000).toFixed(0)} seconds`; // Affichage en anglais
          } else {
              timerDisplay.textContent = `Temps restant : ${(timeLeft / 1000).toFixed(0)} secondes`; // Affichage en français
          }
 
          //timerDisplay.textContent = `Temps restant : ${(timeLeft / 1000).toFixed(0)} secondes`; // Afficher 3 décimales
          startTime = currentTime;
          requestAnimationFrame(updateTimer);
        }
      };
 
      // Démarrer le minuteur
      requestAnimationFrame(updateTimer);
    };
 
 
 
 
 
    // Démarrer le minuteur en fonction de l'état actuel (ex : state === 'traitement')
    if (state === 'traitement') {
      console.log("Démarrage du minuteur pour tpsExo:", tpsExo);
      startTimer(tpsExo, nextPageUrl);
    } else if (state === 'memo') {
      console.log("Démarrage du minuteur pour tpsMemo:", tpsMemo);
      startTimer(tpsMemo, nextPageUrl);
    } else if (state === 'rappel') {
      console.log("Démarrage du minuteur pour tpsRappel:", tpsRappel);
      startTimer(tpsRappel, nextPageUrl);
    }
    else if (state === 'chargement') {
      console.log("Démarrage du minuteur pour chargement:", tps_chargement);
      startTimer(tps_chargement, nextPageUrl);
    }
 
// Lorsque l'on appuie sur entrée et que "saveResponseButton" existe dans html (ie si on est dans un traitement ou rappel), soumet la form.
document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter'){
      event.preventDefault();
      $('#saveResponseButton').trigger("click");
  }
});
//Lorsque la form est soumise, au lieu de la POSTer à la page associée, on récupère ses données et on les envoie à la vue de chargement.
const saveResponseForm = document.getElementById("saveResponseForm"); 
saveResponseForm.addEventListener("submit", handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  if (state === 'traitement') {
    reponse = formData.get("reponse_user")
  }
  else {   //pour le rappel
    formData.delete("csrfmiddlewaretoken") //on ne veut pas du jeton csrf dans la liste de mémos
    //construire la liste de réponse du rappel
    reponse = [];
    for (const value of Array.from(formData.values())) {
      reponse.push(value.replaceAll(',','.'));  //les virgules servent déjà à séparer les éléments d'un JSON donc on les remplace 
    }   
    console.log("reponse rappel",reponse)
  }
  const redirectUrl = `/activite/${serie_id}/${ordre}/chargement/?tempsRestant=${tempsRestant}&ordre=${ordre}&serie_id=${serie_id}&solution=${solution}&exo_id=${exo_id}&state=${state}&reponse=${reponse}`;
  window.location.href = redirectUrl;
}
 
});
