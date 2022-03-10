function myFunction() {
	console.log(document.body.style.backgroundColor);

	if (document.body.style.backgroundColor === "rgb(170, 34, 34)") {
		document.body.style.backgroundColor = "#22AA22";
	}
	else {
		document.body.style.backgroundColor = "#AA2222";
	}
	fakeDelay();
}

function fakeDelay() {
	sleep(300);
	console.log("slept");
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
'use strict';
let comptePromesse = 0;

function testPromise() {
  let thisComptePromesse = ++comptePromesse;

  let log = document.getElementById('log');
  log.insertAdjacentHTML('beforeend', thisComptePromesse +
      ') Started (<small>Début du code synchrone</small>)<br/>');

  // on crée une nouvelle promesse :
  let p1 = new Promise(
    // La fonction de résolution est appelée avec la capacité de
    // tenir ou de rompre la promesse
    function(resolve, reject) {
      log.insertAdjacentHTML('beforeend', thisComptePromesse +
          ') Promise started (<small>Début du code asynchrone</small>)<br/>');

      // Voici un exemple simple pour créer un code asynchrone
      window.setTimeout(
        function() {
          // On tient la promesse !
          resolve(thisComptePromesse);
        }, Math.random() * 2000 + 1000);
    });

  // On définit ce qui se passe quand la promesse est tenue
  // et ce qu'on appelle (uniquement) dans ce cas
  // La méthode catch() définit le traitement à effectuer
  // quand la promesse est rompue.
  p1.then(
    // On affiche un message avec la valeur
    function(val) {
      log.insertAdjacentHTML('beforeend', val +
          ') Promise fulfilled (<small>Fin du code asynchrone</small>)<br/>');
    }).catch(
      // Promesse rejetée
      function() {
        console.log("promesse rompue");
      });

  log.insertAdjacentHTML('beforeend', thisComptePromesse +
      ') Promise made (<small>Fin du code synchrone</small>)<br/>');
}

if ("Promise" in window) {
  let btn = document.getElementById("btn");
  btn.addEventListener("click", testPromise);
 } else {
  log = document.getElementById('log');
  log.innerHTML = "L'exemple live n'est pas disponible pour votre navigateur car celui-ci ne supporte pas l'interface <code>Promise<code>.";
}