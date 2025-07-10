import { check } from "express-validator";

export function checkCoord(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Le coordinate devono essere numeri');
    }
    if (lat < -90 || lat > 90) {
        throw new Error('Latitudine fuori dal range [-90, 90]');
    }
    if (lng < -180 || lng > 180) {
        throw new Error('Longitudine fuori dal range [-180, 180]');
    }
}

export function checkPrice(prezzo_min, prezzo_max) {
    if (typeof prezzo_min !== 'number' || typeof prezzo_max !== 'number') {
        throw new Error('I prezzi devono essere numeri');
    }
    if (prezzo_min < 0 || prezzo_max < 0) {
        throw new Error('I prezzi non possono essere negativi');
    }
    if (prezzo_min > prezzo_max) {
        throw new Error('Il prezzo minimo non può essere maggiore del prezzo massimo');
    }
}

export function checkOfferta(prezzo_offerto, tipo_offerta) {
    if (prezzo_offerto < 0) {
        throw new Error('Il prezzo offerto non può essere negativo');
    }
    if (!['vendita', 'affitto'].includes(tipo_offerta)) {
        throw new Error('Tipo di offerta non valido, deve essere "acquisto" o "affitto"');
    }
}

export function checkFilters(lat, lng, prezzo_min, prezzo_max, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipo_annuncio, climatizzazione) {
    checkCoord(lat, lng);
    checkPrice(prezzo_min, prezzo_max);

    if (dimensione < 0) {
        throw new Error('La dimensione deve essere posotiva');
    }
    if (piano < 0) {
        throw new Error('Il piano deve essere positivo');
    }
    if (stanze < 0) {
        throw new Error('Il numero di stanze deve essere positivo');
    }
    if (ascensore !== null && typeof ascensore !== 'boolean') {
        throw new Error('Ascensore deve essere un booleano');
    }
    if (!['A', 'B', 'C', 'D', 'E', 'F'].includes(classe_energetica)) {
        throw new Error('Classe energetica deve essere una lettera da A a F');
    }
    if (portineria !== null && typeof portineria !== 'boolean') {
        throw new Error('Portineria deve essere un booleano');
    }
    if (tipo_annuncio !== 'qualsiasi' && tipo_annuncio !== 'vendita' && tipo_annuncio !== 'affitto') {
        throw new Error('Tipo di annuncio non valido, deve essere "qualsiasi", "vendita" o "affitto"');
    }
    if (climatizzazione !== null && typeof climatizzazione !== 'boolean') {
        throw new Error('Climatizzazione deve essere un booleano');
    }
}