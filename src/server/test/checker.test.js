import { expect } from 'chai';

import { checkCoord, checkPrice, checkOfferta, checkFilters } from './checker.js';


describe('checkCoord', function () {
    const invalidCases = [
        { lat: 'a', lng: 10 },
        { lat: 10, lng: 'b' },
        { lat: -91, lng: 0 },
        { lat: 91, lng: 0 },
        { lat: 0, lng: -181 },
        { lat: 0, lng: 181 }
    ];
    invalidCases.forEach(({ lat, lng }) => {
        it(`deve lanciare errore con lat=${lat}, lng=${lng}`, function () {
            expect(() => checkCoord(lat, lng)).to.throw();
        });
    });

    it('non deve lanciare errore con coordinate valide', function () {
        expect(() => checkCoord(45, 12)).to.not.throw();
    });
});

describe('checkPrice', function () {
    it('deve lanciare errore se uno dei valori non è un numero', function () {
        expect(() => checkPrice('0', 100)).to.throw('I prezzi devono essere numeri');
        expect(() => checkPrice(0, '100')).to.throw('I prezzi devono essere numeri');
    });

    it('deve lanciare errore se i prezzi sono negativi', function () {
        expect(() => checkPrice(-1, 100)).to.throw('I prezzi non possono essere negativi');
        expect(() => checkPrice(10, -50)).to.throw('I prezzi non possono essere negativi');
    });

    it('deve lanciare errore se prezzo_min > prezzo_max', function () {
        expect(() => checkPrice(200, 100)).to.throw('Il prezzo minimo non può essere maggiore del prezzo massimo');
    });

    it('non deve lanciare errore con prezzi validi', function () {
        expect(() => checkPrice(100, 200)).to.not.throw();
    });
});

describe('checkOfferta', function () {

    // Test con prezzo_offerto negativo (CE non valida)
    it('deve lanciare errore se prezzo_offerto è negativo', function () {
    expect(() => checkOfferta(-100, 'vendita')).to.throw();
    });

    // Test con tipo_offerta non ammesso (CE non valida)
    it('deve lanciare errore se tipo_offerta non è valido', function () {
    expect(() => checkOfferta(200, 'scambio')).to.throw();
    });

    // Test con tipo_offerta = "vendita" (CE valida)
    it('non deve lanciare errore con tipo_offerta = "vendita" e prezzo valido', function () {
    expect(() => checkOfferta(150000, 'vendita')).to.not.throw();
    });

    // Test con tipo_offerta = "affitto" (CE valida)
    it('non deve lanciare errore con tipo_offerta = "affitto" e prezzo valido', function () {
    expect(() => checkOfferta(800, 'affitto')).to.not.throw();
    });

});

describe('checkFilters', function () {

    // Parametri numerici negativi
    it('deve lanciare errore se dimensione è negativa', function () {
    expect(() => checkFilters( 45.0, 9.0, 100000, 400000, -10, 2, 3, true, "A", true, "affitto", false )).to.throw();
    });

    it('deve lanciare errore se piano è negativo', function () {
    expect(() => checkFilters( 45.0, 9.0, 100000, 400000, 50, -1, 3, true, "B", false, "affitto", false )).to.throw();
    });

    it('deve lanciare errore se stanze è negativa', function () {
    expect(() => checkFilters( 45.0, 9.0, 100000, 400000, 70, 1, -2, true, "E", true, "vendita", true )).to.throw();
    });

    // Ascensore non booleano
    it('deve lanciare errore se ascensore non è booleano', function () {
    expect(() => checkFilters( 45.0, 9.0, 100000, 400000, 70, 1, 2, true, "si", "F", true, "affitto", false )).to.throw();
    });

    // Valori validi - ascensore = true
    it('non deve lanciare errore con valori validi e ascensore = true', function () {
    expect(() => checkFilters( 45.0, 9.0, 100000, 400000, 60, 1, 2, true, "B", true, "affitto", true )).to.not.throw();
    });

    // Valori validi - ascensore = false
    it('non deve lanciare errore con valori validi e ascensore = false', function () {
    expect(() => checkFilters(45.0, 9.0, 100000, 400000, 70, 1, 2, false, "A", true, "affitto", false )).to.not.throw();
    });

});