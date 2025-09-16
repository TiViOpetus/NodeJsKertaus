//  KERTAUSTA NODE.JS-KIRJASTOSTA
// ===============================

// KIRJASTOT
// ---------

// Express-palvelin ja Handlebars templating engine
const express = require('express');
const {engine} = require('express-handlebars');

// PostgreSQL-palvelimen yhteysvaranto (pool)
const Pool = require('pg').Pool;


// ASETUKSET
// ---------

// Luodaan varsinainen sovellus Express-kirjastolla
const app = express();

// Määritellään sovellukselle TCP-portti
const PORT = process.env.PORT || 8080;

// Määritellään sovelluksen käyttämät hakemistot
app.use(express.static('public'));
app.use(express.static('images'));

// URL parser
app.use(express.urlencoded({ extended: true }));

// Määritellään sivumallit (templates)
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Määritellään tietokantayhteyden parametrit
const pool = new Pool({
    user: 'websovellus',
    password: 'Q2werty7',
    host: '127.0.0.1',
    port: '5432',
    database: 'autolainaus'
});

// FUNKTIOT
// --------

// Suoritetaan select-kysely
const getSqlData = async (sqlstatement) => {
    let resultset = await pool.query(sqlstatement);
    return resultset; 
};

// URL-REITITYS
// ------------

// Kotisivu
app.get('/', (req, res) => {
    let indexData = {
        'weekday': 'maanatai',
        'meal': 'riisiä ja kanaa tandori-kastikkeessa'
    };
    res.render('index', indexData);
});

// Tietokantatestin sivu
app.get('/dbtest', (req, res) => {
    let pageData = getSqlData("SELECT rekisterinumero, merkki, malli FROM public.vapaana WHERE rekisterinumero = 'OXZ-915'").then((resultset) => {console.log(resultset.rows)});
});
// About-sivu
app.get('/about', (req, res) => {
    let aboutData = {
        'group1': 'TiVi24B',
        'group2': 'TiVi20oa'
    };
    res.render('about', aboutData);
});

// Kuvat-sivu (Staattiset)
app.get('/static', (req, res) =>{
    res.render("images")
});

// Kuvat-sivu (Dynaamiset)
app.get('/dynamic', (req, res) => {
    imageList = [];
    imageList.push({src: "images/testimage.jpg", name: "space"});
    imageList.push({src: "images/testimage2.jpg", name: "forest"});
    res.render("images", { imageList: imageList });
});

app.get('/form', (req, res) => {
    let formData = {
        'name': '',
        'surname': ''
    };
    res.render('form', formData);
});

// POST-reitti lomakkeelle
app.post('/form', (req, res) => {
    const { firstname, surname } = req.body;
    // Datalla saat tiedot talteen esim. Etunimen ja Sukunimen
    res.send(`Lomake vastaanotettu! Etunimi: ${firstname}, Sukunimi: ${surname} ryhmä: ${req.body.group}`);
});

// PALVELIMEN KÄYNNISTYS
// ---------------------

app.listen(PORT);
console.log(`Palvelin käynnistetty portissa ${PORT}`);