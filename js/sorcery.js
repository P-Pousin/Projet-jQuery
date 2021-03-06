$( function() {

	var buttons = $(".section button");
	var status = $("#status");

	var indexSon = 1;
	var nbSon = 3;
	var pv = 3;
	var cd = "false";
	var sections = "";
	var loop = 0;

	//--- Konami Code ---//
	//Haut, haut, bas, bas, gauche, droite, gauche, droite, B, A  
	var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];  
	var n = 0;  
	$(document).keydown(function (e) {  
		if (e.keyCode === konami[n++]) {  
    		if (n === konami.length) {  
        		$("#lecteur audio:last").after("<audio id='song4'controls='controls'><source src='son/Savant_Konami_Kode.mp3' type='audio/mpeg'><source src='son/Savant_Konami_Kode.ogg' type='audio/ogg'></audio>"); 
        		nbSon = 4;
    			indexSon = 3;
    			alert("Bien joué ! Vous avez débloqué la musique secrète");
    			$(".next-audio").click();
        		return !1;  
    		}  
		} else konami = 0;
	}); 

	// Contrôle du lecteur audio
	// Au changement de chanson (bouton prev/next) 
	// La chanson précédente/suivante est cachée
	// Elle est remise à zéro
	// La nouvelle chanson est affichée et lancée
	$(".prev-audio").click(function() {
		if(indexSon > 1) {
			indexSon--; 
		} 
		$("audio").trigger("pause").css("display","none"); 
		$("#song"+indexSon).prop("currentTime",0);
		$("#song"+indexSon).css("display", "inline").trigger('play');

		$("#lecteur p span").css("display", "none");
		$("#title"+indexSon).css("display", "inline");

	});

	$(".next-audio").click(function() {
		indexSon++;
		if(indexSon >= nbSon) {
			indexSon = nbSon;
		}
		$("audio").trigger("pause").css("display","none");
		$("#song"+indexSon).prop("currentTime",0);
		$("#song"+indexSon).css("display", "inline").trigger('play');

		$("#lecteur p span").css("display", "none");
		$("#title"+indexSon).css("display", "inline");

	});
	
	// Permet de relancer les gifs qui n'ont pas de lecture infinie
	function refresh_gif(){
		for (var i = 1; i < 4; i++) {
			var obj = $("#gif"+i);
			var src_img = obj.attr("src")+"?loop="+loop;
			obj.attr("src",src_img);
		};
		loop += 1;
	}

	//Réinitialisation des variables
	function reset() {
		refresh_gif();
		pv = 3;
		//Gestion de l'item CD
		cd = false;	
		$(".cd").remove();
		$("#vario button").attr("go","vario-2");
		$("#vario button").attr("pv-","2");
		setLife();
	}
	
	function samuraiFight(nb) {
		$(document).unbind('keydown');
		$("#combinaison-"+nb).show();
		if (nb==1){
      		var time = 5000;}
      	else{
      		if (nb==2){
      			var time = 4000;}
      		else{
      			var time = 3000;}
      	}
		setTimeout(function() {
      		$("#combinaison-"+nb).hide();
      		//alert(nb);
      		var win = false;
      		if (nb==1){
      			// Haut Droite Bas Haut
      			var k = [38, 39, 40, 38];}
      		else{
      			if (nb==2){
      				var k = [39, 37, 40, 37];}
      			else{
      				var k = [40, 37, 39, 38];}
      		}
			n = 0; 
			$(".your-turn").show();
      		$(document).keydown(function (e) {  
    			if (e.keyCode === k[n++])
    			{
        			if (n === k.length)
        			{
           				$(".gg").show();	
           				win = true; 
        			}
    			}
    			else
    			{	
    				if (!win) {
    					$(".zero").show();
    				}
    			}
			}); 
		}, time);
	}

	//Déplacement de section en section
	function gotoSection(key) {
		$(".section").hide();
		$("#"+key).fadeToggle();
	}
	
	//Récupération des points de vie actuel
	function getLife() {
		return pv;
	}
	
	//Affiche les points de vie
	function setLife() {
		var nbPV = "";
		for(var i = 1; i <= pv; i++) {
			nbPV += "<img class='pv' src='img/PV-Vario3.png'></img>";
		}
		$(".life .value").html(nbPV);
	}

	//Supression d'une vie
	function loseLife(pts) {
		pv -= pts;
		setLife();
	}

	//Gain d'une vie
	function winLife(pts) {
		pv += parseInt(pts);
		setLife();
	}

	//Retourne au début
	function startGame() {
		reset();
		gotoSection("intro");
	}

	function endGame() {
		gotoSection("dead");
	}

	//Affiche le cd ou non en veillant à adapter la route du boss Vario
	function setCD(cdVal) {
		cd = cdVal;
		if(cd == "true") {
			//Affiche la possession du CD
			$(".item .value").html("<img class='cd' src='img/cd.png'></img>");
			//Change le message de perte du CD d'une route
			$("#cd").html("Vous perdez 1PV et votre CD ...");
			//Change la route du boss
			$("#vario button").attr("go","vario-1");
			//Ajoute le nombre de pv perdu
			$("#vario button").attr("pv-","1");
		} else {
			$(".item .value").html("--");
			$("#vario button").attr("go","vario-2");
			$("#vario button").attr("pv-","2");
		}
	}

	function setStone() {
		//Affiche la possession de la pierre philosophale
		$(".item .value").append("<img class='stone' src='img/stone.png'></img>");
	}
	
	buttons.click( function() {
		if(getLife() == 0) {
			endGame();
		} else {
			var go = $(this).attr("go");
			var nb = $(this).attr("nb");

			//Section où le joueur gagne des points de vie
			if($(this).attr("pv+") != undefined) {
				winLife($(this).attr("pv+"));
			}

			//Section où le joueur perd des points de vie
			if($(this).attr("pv-") != undefined) {
				loseLife($(this).attr("pv-"));
			}

			//Gestion de l'item bonus CD
			if($(this).attr("cd") != undefined) {
				setCD($(this).attr("cd"));
			}

			//Gestion du point de sauvegarde de la partie
			if($(this).attr("ckpoint") != undefined) {
				setStone();
			}

			if (go!="samurai-fight"){
				gotoSection(go);
			}

			//Evènements exceptionnels 
			if (go=="go-out") {
				setTimeout(function() {
	      			gotoSection("samurai0");
				}, 2000);
			}

			if (go=="dodge") {
				setTimeout(function() {
						$("#wyrm1").hide('slow');
						$("#wyrm2").show('slow');
				}, 2000);
				setTimeout(function() {
					$("#wyrm2").hide('slow');
					$("#wyrm3").show('slow');
				}, 4000);
			}
			
			if (go=="samurai-fight") {
				$(".section").hide();
				$("#samurai-fight-"+nb).fadeToggle();

				$(".cacher").show();
				$(".your-turn, .gg, .zero").hide();
				$(document).unbind('keydown');
				setTimeout( function() {
					$(".cacher").hide();
					samuraiFight(nb);
				}, 7000);
			}
		}
	});

	//Recommencer la partie
	$(".reset").click(function() {
		startGame();
	});

	$(".reset-ck").click(function() {
		reset();
	});

	//Affichage des points de vie
	setLife();
});

