import test from 'node:test';
import assert from 'node:assert/strict';

import { skalMeldingBehandles } from './skal-melding-behandles';

import { Melding } from '../types/melding';

test('returnerer false dersom arbeidssøkeren har svar NEI på spørsmål 5', () => {
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
