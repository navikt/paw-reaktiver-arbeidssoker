import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import kanArbeidssokerenReaktiveres from './kan-arbeidssokeren-reaktiveres';
import { Periode } from './arbeidssokerperioder';

describe('tester kanArbeidssokerenReaktiveres', () => {
    it('returnerer FALSE dersom arbeidssøkerperioder IKKE er AVSLUTTET', () => {
        const arbeidssokerperioder: Periode[] = [
            {
                fraOgMedDato: '2022-12-12',
                tilOgMedDato: null,
            },
        ];
        const resultat = kanArbeidssokerenReaktiveres(arbeidssokerperioder);
        const forventetResultat = false;
        assert.equal(resultat, forventetResultat);
    });

    it('returnerer FALSE dersom arbeidssøkerperioder er AVSLUTTET for MER enn 28 dager siden', () => {
        const arbeidssokerperioder: Periode[] = [
            {
                fraOgMedDato: '2021-12-12',
                tilOgMedDato: '2022-01-31',
            },
        ];
        const resultat = kanArbeidssokerenReaktiveres(arbeidssokerperioder);
        const forventetResultat = false;
        assert.equal(resultat, forventetResultat);
    });

    it('returnerer TRUE dersom arbeidssøkerperioder er AVSLUTTET for MINDRE enn 28 dager siden', () => {
        const iDag = new Date().toISOString().substring(0, 10);
        const arbeidssokerperioder: Periode[] = [
            {
                fraOgMedDato: '2021-12-12',
                tilOgMedDato: iDag,
            },
        ];
        const resultat = kanArbeidssokerenReaktiveres(arbeidssokerperioder);
        const forventetResultat = true;
        assert.equal(resultat, forventetResultat);
    });
});
