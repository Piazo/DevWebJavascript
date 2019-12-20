//variables globales
var temps_max=9999999;
var score = 0;
var vitesse = 1;
var Niveau = 1;
var Vies = 3;
var Apparition = 200;
var Xbleu=0;
var Ybleu=0;

// canvas
var canvas = document.getElementById("ecran");
if (canvas.getContext){
	var context = canvas.getContext('2d');

	} else {
	alert('canvas non supporté par ce navigateur');
}

//Bulles
Bulles = [];
Bleu = [10,"blue",0,0,1];

// timers
var inter;
var niveaux;
var add_bubble;
var curseur;

// fonction pour passer d'un écran a un autre
function div_vers_div(div1,div2){
	var accueil = document.getElementById(div1);
	var jeu = document.getElementById(div2);
	accueil.style.display="none";
	jeu.style.display="block";
}

//fonction générique de dessin des bulles
function dessine_bulle(bulle){
	if (bulle[4]==1){
		context.beginPath();
		context.lineWidth="2";
		var X=bulle[2]-canvas.offsetLeft;
		var Y=bulle[3]-canvas.offsetTop;
		context.arc(bulle[2]-canvas.offsetLeft, bulle[3]-canvas.offsetTop, bulle[0], 0, 2 * Math.PI);
		context.fillStyle = bulle[1];
		context.fill();
		context.stroke();
	}	
}

//fonction de jeu, initialisation des variables et passage a l'écran de jeu
function jeu(){
	div_vers_div("accueil","jeu");
	Bulles=[];
	temps_max=2000000;
	setTimeout(Stopper, temps_max);
	score = 0;
	vitesse = 1;
	Niveau = 1 ;
	Vies = 3 ;
	Apparition = 200 ;
	inter = setInterval(Dessin,10);
	niveaux = setInterval(lvl,20000);
	add_bubble = setInterval(Add_Bubble,200);
	curseur = setInterval(Curseur,10);
	Afficher_score();
}

// fonction du déplacement de la souris
function Deplacement_souris(e) {
	var sourisX=e.clientX;
	var sourisY=e.clientY;
	Xbleu = sourisX;
	Ybleu = sourisY;
	var distance = 1000;
	// Conditions sur les bordures
	if (sourisY>canvas.offsetTop+canvas.height){
		Ybleu=canvas.offsetTop+canvas.height;
	}
	if (sourisX>canvas.offsetLeft+canvas.width){
		Xbleu=canvas.offsetLeft+canvas.width;
	}
	if (sourisX<canvas.offsetLeft){
		Xbleu=canvas.offsetLeft;
	}
	if (sourisY<canvas.offsetTop){
		Ybleu=canvas.offsetTop;
	}
	Bleu[2]=Xbleu;
	Bleu[3]=Ybleu;
}

//fonction d'affichage de score
function Afficher_score() {
	document.getElementById("score").innerHTML ="Score : " + score;
	document.getElementById("niveau").innerHTML ="Niveau : " + Niveau;
	document.getElementById("vies").innerHTML ="Vies : " + Vies;
}


// fonction d'arrêt
function Stopper() {
	clearInterval(curseur);
	clearInterval(add_bubble);
	clearInterval(inter);
	clearInterval(niveaux);
}

// fonction pour l'animation des bulles
function Animer() {
	for (var i=0; i<Bulles.length; i++){
		Bulles[i][3]=Bulles[i][3]+vitesse;
		dessine_bulle(Bulles[i]);
	}
}

// fonction de dessins des bulles généralisé
function Dessin() {
	context.clearRect(0,0, canvas.width,canvas.height);
	Animer();
	dessine_bulle(Bleu);
	Afficher_score();
}

//fonction pour dessiner la bulle bleue, et gérer les collisions
function Curseur(){
	dessine_bulle(Bleu);
	for (var i=0 ; i<Bulles.length ; i++){
		//calcul de la distance entre la bulle i du tableau et le curseur
		distance=(((Math.abs(Xbleu-Bulles[i][2]))**2+(Math.abs(Ybleu-Bulles[i][3]))**2)**0.5);
		if (Bulles[i][4]==1 && distance<10+Bulles[i][0]){
			if (Bulles[i][1]=="green"){
				score=score+10;
				Bulles[i][4]=0;
				}else{
				Vies=Vies-1;
				Bulles[i][4]=0;
				if (Vies==0){
					Bilan();
				}
			}
		}
	}
}

//fonctions qui change les paramètres a changer lors d'un nouveau niveau
function lvl(){
	Niveau=Niveau+1;
	vitesse=vitesse+0.5;
	Apparition=Apparition/2;
	clearInterval(add_bubble);
	add_bubble = setInterval(Add_Bubble,Apparition);
}

//fonction pour ajouter une bulle au tableau
function Add_Bubble(){
	var Couleur = Math.random()
	var Remplissage = "black";
	if (Couleur>0.9){
		Remplissage = "green";
	}
	var Rayon = Math.random()*20+5;
	var X = canvas.offsetLeft - Rayon + Math.random()*600;
	var Y = canvas.offsetTop - Rayon;
	Bulles.push([Rayon,Remplissage,X,Y,1]);
}

//fonction de transition entre le jeu et le bilan
function Bilan(){
	clearInterval(curseur);
	clearInterval(add_bubble);
	clearInterval(inter);
	clearInterval(niveaux);
	div_vers_div("jeu","bilan");
	document.getElementById("score_final").innerHTML ="Score Final : " + score;
}

//fonction de transition entre le bilan et le jeu, si l'utilisateur souhaite rejouer
function rejouer() {
	div_vers_div("bilan","accueil");
	jeu();
}

//fonction pour quitter le jeu si l'utilisateur le désire
function quitter() {
	clearInterval(curseur);
	clearInterval(add_bubble);
	clearInterval(inter);
	clearInterval(niveaux);
	div_vers_div("jeu","accueil");
}