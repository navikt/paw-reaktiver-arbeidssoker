import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { skalMeldingBehandles } from './skal-melding-behandles';
import { plussDager } from './plussdager';

import { Melding } from '../types/melding';

describe('tester skalMeldingBehandles', () => {
    it('returnerer FALSE dersom arbeidssøkeren har svart NEI på spørsmål 5', () => {
        const melding = {
            fnr: '12345678910',
            arbeidssokerNestePeriode: false,
            periodeFra: '2022-11-28',
            periodeTil: '2022-12-11',
            kortType: 'ELEKTRONISK',
            opprettet: '2022-12-12',
        } as Melding;

        const resultat = skalMeldingBehandles(melding);
        const forventetResultat = false;

        assert.equal(resultat, forventetResultat);
    });

    it('returnerer FALSE dersom arbeidssøkeren har svart JA på spørsmål 5 og periodeTil + 14 dager er i FORTIDEN', () => {
        const melding = {
            fnr: '12345678910',
            arbeidssokerNestePeriode: true,
            periodeFra: '2021-11-28',
            periodeTil: '2021-12-11',
            kortType: 'ELEKTRONISK',
            opprettet: '2021-12-12',
        } as Melding;

        const resultat = skalMeldingBehandles(melding);
        const forventetResultat = false;

        assert.equal(resultat, forventetResultat);
    });

    it('returnerer TRUE dersom arbeidssøkeren har svart JA på spørsmål 5 og periodeTil + 14 dager er i FREMTIDEN', () => {
        const iDag = new Date();
        const iDagStreng = iDag.toISOString().substring(0, 10);
        const periodeFra = plussDager(iDag, -7).toISOString().substring(0, 10);
        const melding = {
            fnr: '12345678910',
            arbeidssokerNestePeriode: true,
            periodeFra,
            periodeTil: iDagStreng,
            kortType: 'ELEKTRONISK',
            opprettet: iDagStreng,
        } as Melding;

        const resultat = skalMeldingBehandles(melding);
        const forventetResultat = true;

        assert.equal(resultat, forventetResultat);
    });
});
