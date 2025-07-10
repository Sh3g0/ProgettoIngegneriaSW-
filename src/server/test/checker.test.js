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
    it('deve lanciare errore se prezzo_offerto è negativo', function () {
        expect(() => checkOfferta(-10, 'vendita')).to.throw('Il prezzo offerto non può essere negativo');
    });

    it('deve lanciare errore se tipo_offerta è invalido', function () {
        expect(() => checkOfferta(100, 'scambio')).to.throw('Tipo di offerta non valido');
    });

    it('non deve lanciare errore con valori validi', function () {
        expect(() => checkOfferta(1000, 'affitto')).to.not.throw();
    });
});

describe('checkFilters', function () {
    it('deve lanciare errore se dimensione è negativa', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, -1, 1, 2, true, 'A', true, 'vendita', true)
        ).to.throw('La dimensione deve essere posotiva');
    });

    it('deve lanciare errore se piano è negativo', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, -1, 2, true, 'A', true, 'vendita', true)
        ).to.throw('Il piano deve essere positivo');
    });

    it('deve lanciare errore se stanze è negativo', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, 2, -1, true, 'A', true, 'vendita', true)
        ).to.throw('Il numero di stanze deve essere positivo');
    });

    it('deve lanciare errore se ascensore non è booleano', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, 2, 1, 'yes', 'A', true, 'vendita', true)
        ).to.throw('Ascensore deve essere un booleano');
    });

    it('non deve lanciare errore con tutti i parametri validi', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, 2, 1, true, 'A', true, 'vendita', false)
        ).to.not.throw();
    });
});