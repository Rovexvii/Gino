const TERRA = "0xB96E54";
const VERDE = "0x72A11D";
const ROSSO = "0xE44A4A";
const NERO = "0x000000";

const ARANCIONE = "0xFF8014"
const R_FUOCO = 12;
const TASTO_FUOCO = PP.key_codes.F;

const DISTANZA_MAX = 600;

const TASTO_SALTO = PP.key_codes.SPACE;
const VEL_SALTO = 1000;
const VEL_FUOCO = 600;

const A_TERRENO = 96;
const Y_TERRENO = 624;
const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;
const L_FUNGO = 90;
const A_FUNGO = 63;

const VEL_INIZIALE = 400;
const ACCELERAZIONE = 20;

let terreno;
let gino;
let fungo;
let vel_fungo = VEL_INIZIALE;
let partita_finita = false;
let testo_fine;
let testo_rigioca;
let fuoco = null;

let immagine_sfondo;
let immagine_terreno;
let immagine_gino;
let immagine_fungo;
let immagine_fuoco;


function preload(s) {
    immagine_sfondo = PP.assets.image.load(s, "assets/images/sfondo-2.png");
    immagine_terreno = PP.assets.image.load(s, "assets/images/terreno.png");
    immagine_gino = PP.assets.image.load(s, "assets/images/gino.png");
    immagine_fungo = PP.assets.image.load(s, "assets/images/fungo.png");
    immagine_fuoco = PP.assets.image.load(s, "assets/images/fuoco.png");
}

function crea_terreno(s) {
   terreno = PP.assets.image.add(s, immagine_terreno, LARGHEZZA / 2, Y_TERRENO + A_TERRENO / 2, 0.5, 0.5); 

    PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
    gino = PP.assets.image.add(s, immagine_gino, X_GINO, Y_TERRENO - A_GINO / 2, 0.5, 0.5);

    PP.physics.add(s, gino, PP.physics.type.DYNAMIC);
    PP.physics.set_collide_world_bounds(gino, true);
    PP.physics.add_collider(s, gino, terreno);
    PP.physics.set_collision_rectangle(gino, 51, 72, 15, 12);
}

function crea_fungo(s) {
    fungo = PP.assets.image.add(s, immagine_fungo, LARGHEZZA * 3 / 4, Y_TERRENO - A_FUNGO / 2, 0.5, 0.5);

    PP.physics.add(s, fungo, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(fungo, false);
    PP.physics.set_velocity_x(fungo, -vel_fungo);
    PP.physics.add_overlap_f(s, gino, fungo, fine_partita);
}


function crea_fine(s) {
    testo_fine = PP.shapes.text_styled_add(s, LARGHEZZA / 2, ALTEZZA / 3, "GAME OVER", 64, "Arial", "bold", NERO, null, 0.5, 0.5);
    testo_fine.visibility.hidden = true;

    testo_rigioca = PP.shapes.text_styled_add(s, LARGHEZZA / 2, ALTEZZA / 2, "RIGIOCA (SPAZIO)", 40, "Arial", "bold", NERO, null, 0.5, 0.5);
    testo_rigioca.visibility.hidden = true;
}

function create(s) {
    PP.assets.image.add(s, immagine_sfondo, 0, 0, 0, 0);
    crea_terreno(s);
    crea_gino(s);
    crea_fungo(s);
    crea_fine(s);
}

function salta(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO) && 
    PP.physics.is_on_ground(gino)) {
        PP.physics.set_velocity_y(gino, -VEL_SALTO);
    }
}

function controlla_fungo(s) {
    if (fungo.geometry.body_x < -L_FUNGO) {
        vel_fungo += ACCELERAZIONE;
        resetta_fungo(s);
    }
}

function resetta_fungo() {
    fungo.geometry.x = LARGHEZZA + L_FUNGO / 2 + DISTANZA_MAX * Math.random(); /*CON MATH.RANDOM MI CREA UNA DISTANZA CASUALE*/
    PP.physics.set_velocity_x(fungo, -vel_fungo);
}

function ricomincia(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)) {
    partita_finita = false;
    vel_fungo = VEL_INIZIALE;
    resetta_fungo(s);
    testo_fine.visibility.hidden = true;
    testo_rigioca.visibility.hidden = true;
    }
}

function spara(s) {
if (fuoco === null && PP.interactive.kb.is_key_just_down(s, TASTO_FUOCO)) {
    fuoco = PP.assets.image.add(s, immagine_fuoco, gino.geometry.body_x + L_GINO, gino.geometry.body_y + A_GINO / 4, 0.5, 0.5);

    PP.physics.add(s, fuoco, PP.physics.type.DYNAMIC);
    PP.physics.set_velocity_x (fuoco, VEL_FUOCO);
    PP.physics.add_collider (s, fuoco, terreno);
    PP.physics.set_bounce_y (fuoco, 1);
    PP.physics.add_overlap_f(s, fuoco, fungo, brucia);
    }
}

function brucia(s, a, fungo) {
    PP.assets.destroy(fuoco);
    fuoco = null;
    resetta_fungo(s);
}

function controlla_fuoco() {
    if (fuoco !== null && fuoco.geometry.body_x > LARGHEZZA) {
        PP.assets.destroy(fuoco);
        fuoco = null;
    }
}

function fine_partita(s, gino, fungo) {
    partita_finita = true;
    PP.physics.set_velocity_x(fungo, 0);
    testo_fine.visibility.hidden = false;
    testo_rigioca.visibility.hidden = false;
}

function update(s) {
    if (partita_finita) {
        ricomincia(s);
        return;
    }
    salta(s);
    spara(s);
    controlla_fungo();
    controlla_fuoco();
}

function destroy(s) {}

PP.scenes.add("gino", preload, create, update, destroy);