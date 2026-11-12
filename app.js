
// =============================================
// ÉTAT DU JEU
// Un objet qui contient toutes les données
// de la partie. Quelles propriétés mettre dedans ?
// =============================================

let statut = {
    faim : 80,
    bonheur : 80, 
    energie : 80,
    dodo: true, 
    vivant : true, 
    heure_de_jeu : 8, 
    minute_de_jeu : 0, 
}


// =============================================
// SONS
// Comment jouer un fichier audio en JavaScript ?
// Quelle information a-t-on besoin de passer ?
// =============================================


function jouer_son (fichier) {
    const audio = new Audio ('/sons/' +fichier )
    audio.play();
}


// =============================================
// SAUVEGARDE
// Comment garder les données même après
// avoir fermé / rechargé la page ?
// =============================================


function save() {
    localStorage.setItem('tamagotchi', JSON.stringify(statut))
}
function load_save() {
    const save = localStorage.getItem('tamagotchi')
    if (save) {
        statut = JSON.parse(save)
    }
}


// =============================================
// EST-CE QUE C'EST LA NUIT ?
// À partir de quelle heure fait-il nuit ?
// À partir de quelle heure fait-il jour ?
// =============================================

function nuit() {
    return statut.heure_de_jeu >= 22 || statut.heure_de_jeu < 8
}



// =============================================
// QUEL EMOJI AFFICHER ?
// En fonction de l'état du pet, quel emoji
// faut-il afficher ? (mort, dort, faim, triste...)
// =============================================

function emoji() {
    if (!statut.vivant) return '💀'
    if (statut.dodo) return '😴'
    if (statut.faim < 20) return '🤤'
    if (statut.bonheur < 20) return '😢'
    if (statut.energie < 20) return '🥱'

    const moyenne = (statut.bonheur + statut.energie + statut.faim) / 3 ;
    if (moyenne > 80) return '😄'
    if (moyenne > 60) return '🙂'
    if (moyenne > 40) return '😐'
    return '😟'

}

// =============================================
// QUEL MESSAGE AFFICHER ?
// Même logique mais pour le texte sous le pet
// =============================================

function fatigue_extreme() {
    return statut.vivant && !statut.dodo && statut.energie < 20
}

function humeur_message() {
    if (!statut.vivant) return 'Ton compagnon ne répond plus...'
    if (statut.dodo) return 'Chut... je dors profondément.'
    if (statut.faim < 20) return 'J ai vraiment faim, donne-moi quelque chose a manger !'
    if (statut.bonheur < 20) return 'Je me sens un peu seul, viens jouer avec moi.'
    if (fatigue_extreme()){
        return 'Je suis fatigue, une petite sieste me ferait du bien.'
    } 

    const moyenne = (statut.faim + statut.bonheur + statut.energie) /3 
    if (moyenne > 80) return 'Je suis en pleine forme !'
    if (moyenne > 60) return 'Tout va bien, continue comme ca.'
    if (moyenne > 40) return 'Ca pourrait aller mieux, occupe-toi un peu de moi.'
    return 'Je ne vais pas tres bien... aide-moi vite !'

}


// =============================================
// METTRE À JOUR L'AFFICHAGE
// Comment répercuter les données de "state"
// sur ce que l'utilisateur voit ?
// (jauges, emoji, horloge, boutons...)
// =============================================

function afficher() {
    const jauges = ['faim', 'bonheur', 'energie']
    jauges.forEach(function (jauge) {
        const valeur = Math.round(statut[jauge])
        document.getElementById('gauge-' + jauge).style.width = valeur + '%'
        document.getElementById('val-' + jauge).textContent = valeur
        document.getElementById('gauge-' + jauge).classList.toggle('critical', valeur < 20)
    })

    document.getElementById('pet-scene').classList.toggle('fatigue', fatigue_extreme())

    //mise à jour de bouboule 

    const bouboule = document.getElementById('pet-emoji')
    bouboule.textContent = emoji()
    if (!statut.vivant) {
        bouboule.className = ''
    }
    else if (statut.dodo) {
        bouboule.className = 'sleeping'
    }
    else {
        bouboule.className = 'idle'
    }

    //Mise à jour du message d'humeur
    document.getElementById('mood-msg').textContent = humeur_message()
    
    const h = String(statut.heure_de_jeu).padStart(2, '0')
    const m = String(statut.minute_de_jeu).padStart(2, '0')

    const icone = nuit () ? '🌙' : '☀️'
    document.getElementById('game-clock').textContent = icone + '' + h + ':' + m

    document.getElementById('btn-feed').disabled = !statut.vivant || statut.dodo
    document.getElementById('btn-play').disabled = !statut.vivant || statut.dodo
    document.getElementById('btn-sleep').disabled = !statut.vivant 
}


// =============================================
// PARTICULES
// Créer un emoji qui s'envole au-dessus du pet
// Comment créer un élément HTML en JS ?
// Comment le supprimer après l'animation ?
// =============================================

function particule (emojiParticule) {
    const scene = document.getElementById('pet-scene')
    const element = document.createElement('div')
    element.className = 'particle'
    element.textContent = emojiParticule
    element.style.left = (25 + Math.random() * 40 ) + "%"
    element.style.bottom = '35%'
    scene.appendChild(element)
    setTimeout (() => {
        element.remove()
    },1200
    
    )
}

// =============================================
// NOTIFICATION (TOAST)
// Afficher un message temporaire en bas de page
// Comment le faire disparaître automatiquement ?
// =============================================

let timer_toast = null 

function toast (message) {
    const element = document.getElementById('toast')
    element.textContent = message 
    element.classList.add('show')
    clearTimeout(timer_toast)
    timer_toast = setTimeout(function() {element.classList.remove('show')},3000)
}

// =============================================
// ACTION — NOURRIR
// Que se passe-t-il quand on clique sur 🍎 ?
// Quelle jauge change ? De combien ?
// =============================================

function nourrir() {
    if(!statut.vivant || statut.dodo) return 
    statut.faim = Math.min(100, statut.faim + 20 )
    toast('Miam ! Merci pour le repas.')
    jouer_son('nourrir.mp3')
    particule('🍎')
    particule('🍎')
    particule('🍎')
    const bouboule = document.getElementById('pet-emoji') 
    bouboule.className = 'eating'

    setTimeout(function() {bouboule.className= 'idle'}, 1800) 

    save()
    afficher()

}

// =============================================
// ACTION — JOUER
// Que se passe-t-il quand on clique sur 🎾 ?
// Que faire si le pet est trop fatigué ?
// =============================================

function play() {
    if(!statut.vivant || statut.dodo) return 
    if(statut.energie < 20) {
        toast('Je suis trop fatigue pour jouer.')
        return
    }

    statut.energie = Math.max(0, statut.energie - 10 )
    statut.bonheur = Math.min(100, statut.bonheur + 10 )
    toast('Super partie !')
    jouer_son('jouer.mp3')
    particule('🎾')
    particule('🎾')
    particule('🎾')
    particule('🎾')
    const bouboule = document.getElementById('pet-emoji') 
    bouboule.className = 'happy'

    setTimeout(function() {bouboule.className= 'idle'}, 1800) 
    save()
    afficher()

}

// =============================================
// ACTION — DORMIR
// Comment gérer le toggle endormi / réveillé ?
// =============================================

function dodo() {
    if(!statut.vivant) return

    if(statut.dodo) {
        statut.energie = Math.min(100, statut.energie + 30)
        statut.dodo = false 
        toast('Je suis reveille !')
        jouer_son('reveil.mp3')
        particule('☀️')
        particule('☀️')
        particule('☀️')
    } 
    else {
        statut.dodo = true
        toast ('Bonne nuit, a tout a l heure.')
        jouer_son('dormir.mp3')
        particule('💤')
    }
    const bouboule = document.getElementById('pet-emoji') 
    save()
    afficher()
}

// =============================================
// MORT DU PET
// Que faut-il faire quand une jauge atteint 0 ?
// =============================================

function mourir(raison) {
    statut.vivant = false
    document.getElementById('death-reason').textContent = raison
    save()
    afficher()
    renaitre()
    toast('il est mort')
}

// =============================================
// RECOMMENCER
// Remettre toutes les valeurs à zéro
// =============================================

function renaitre() {
    statut = {
        faim : 80,
        bonheur : 80,
        energie : 80,
        dodo: false,
        vivant : true,
        heure_de_jeu : 8,
        minute_de_jeu : 0,
    }
    save()
    afficher()
    toast('Nouvelle partie lancee !')
}

// =============================================
// BOUCLE DE JEU
// La fonction appelée toutes les X secondes
// Elle fait avancer le temps et fait baisser
// les jauges automatiquement
// =============================================

function boucle(){
    statut.faim = Math.max(0, statut.faim - 0.2)
    statut.bonheur = Math.max(0, statut.bonheur - 0.1)

    if (nuit()) {
        statut.energie = Math.min(100, statut.energie + 0.15)
    }
    else {
        statut.energie = Math.max(0, statut.energie -0.15)
    }

    if (statut.faim <= 0) return mourir ("Mon pioupiou il est mort (emoji triste)")
    if (statut.bonheur <= 0) return mourir ("Mon pioupiou il est mort (emoji triste)")
    if (statut.energie <= 0) return mourir ("Mon pioupiou il est mort (emoji triste)")
    save ()
    afficher()
}

// =============================================
// DÉMARRAGE
// Que faut-il faire au chargement de la page ?
// =============================================
load_save()
afficher()
setInterval(boucle, 800)
