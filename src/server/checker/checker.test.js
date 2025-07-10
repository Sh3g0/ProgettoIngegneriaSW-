const { expect } = require('chai');
const {
    checkCoord,
    checkPrice,
    checkOfferta,
    checkFilters
} = require('./checker');

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
        it(`dovrebbe lanciare errore con lat=${lat}, lng=${lng}`, function () {
            expect(() => checkCoord(lat, lng)).to.throw();
        });
    });

    it('non dovrebbe lanciare errore con coordinate valide', function () {
        expect(() => checkCoord(45, 12)).to.not.throw();
    });
});

describe('checkPrice', function () {
    it('dovrebbe lanciare errore se uno dei valori non è un numero', function () {
        expect(() => checkPrice('0', 100)).to.throw('I prezzi devono essere numeri');
        expect(() => checkPrice(0, '100')).to.throw('I prezzi devono essere numeri');
    });

    it('dovrebbe lanciare errore se i prezzi sono negativi', function () {
        expect(() => checkPrice(-1, 100)).to.throw('I prezzi non possono essere negativi');
        expect(() => checkPrice(10, -50)).to.throw('I prezzi non possono essere negativi');
    });

    it('dovrebbe lanciare errore se prezzo_min > prezzo_max', function () {
        expect(() => checkPrice(200, 100)).to.throw('Il prezzo minimo non può essere maggiore del prezzo massimo');
    });

    it('non dovrebbe lanciare errore con prezzi validi', function () {
        expect(() => checkPrice(100, 200)).to.not.throw();
    });
});

describe('checkOfferta', function () {
    it('dovrebbe lanciare errore se prezzo_offerto è negativo', function () {
        expect(() => checkOfferta(-10, 'vendita')).to.throw('Il prezzo offerto non può essere negativo');
    });

    it('dovrebbe lanciare errore se tipo_offerta è invalido', function () {
        expect(() => checkOfferta(100, 'scambio')).to.throw('Tipo di offerta non valido');
    });

    it('non dovrebbe lanciare errore con valori validi', function () {
        expect(() => checkOfferta(1000, 'affitto')).to.not.throw();
    });
});

describe('checkFilters', function () {
    it('dovrebbe lanciare errore se dimensione è negativa', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, -1, 1, 2, true, 'A', true, 'vendita', true)
        ).to.throw('La dimensione deve essere posotiva');
    });

    it('dovrebbe lanciare errore se piano è negativo', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, -1, 2, true, 'A', true, 'vendita', true)
        ).to.throw('Il piano deve essere positivo');
    });

    it('dovrebbe lanciare errore se stanze è negativo', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, 2, -1, true, 'A', true, 'vendita', true)
        ).to.throw('Il numero di stanze deve essere positivo');
    });

    it('dovrebbe lanciare errore se ascensore non è booleano', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, 2, 1, 'yes', 'A', true, 'vendita', true)
        ).to.throw('Ascensore deve essere un booleano');
    });

    it('non dovrebbe lanciare errore con tutti i parametri validi', function () {
        expect(() =>
            checkFilters(10, 10, 0, 100, 100, 2, 1, true, 'A', true, 'vendita', false)
        ).to.not.throw();
    });
});