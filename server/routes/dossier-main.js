var express = require('express');
var router = express.Router();
var path = require('path');

var config = require('../config');
var Dossier = require('../models/dossier-model');
var Sequence = require('../models/sequence-model');

/**
 * Return thge dossier with given id
 * @route {GET} /dossier/:id
 * @routeparam {string} :id is the unique ObjectId of the dossier requested
 * @returns {DossierObject} dosssier-object
 */
router.get('/:id', function(req, res){
    console.log("Testing /dossier/:id get route. params: ", req.params);
    res.send('Returned one dossier with id ', req.params.id);
});

/**
 * Returns list of all dossiers
 * @route {GET} /dossier
 * @returns {Array of DossierObject} Array of dossiers [{dosssier-object,....}]
 */
router.get('/', function(req, res) {
    console.log('Testing /dossier routes');
    req.send('Returning all dossiers');
});

/**
 * Saves given dossier-object in the database
 * @route {POST} /dossier
 * @bodyparam {DossierObject} dossier objevt to be saved in the database
 */
router.post('/', function(req, res, next){
    Dossier.create(req.body)
    .then(function(dossier){
        var dossierId = dossier._id;
        var curSequence = Sequence.getCurSequence(dossier.Sequences);
        var templatePath = getTemplatePath(dossier);
        res.send(dossierId);
    })
    .catch(function(err){
        res.status(500).send(err); 
    });
});

function getTemplatePath(dossier){
    var folder = dossier.Region + '-' + dossier.ApplicationType + '-ectd' + dossier.EctdVersion;
    return path.join(config.TEMPLATES_PATH, folder);
}
module.exports = router;

