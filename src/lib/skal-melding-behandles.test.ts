import skalMeldingBehandles from './skal-melding-behandles';
import plussDager from './plussdager';

import { MeldekortMelding } from '../types/meldekort-melding';

describe('tester skalMeldingBehandles', () => {
    it('returnerer FALSE dersom det er svart NEI til spm 5', () => {
        const melding: MeldekortMelding = {
            fnr: '12345678910',
            arbeidssokerNestePeriode: false,
            periodeFra: '2022-11-28',
            periodeTil: '2022-12-11',
            kortType: 'ELEKTRONISK',
            opprettet: '2022-12-12',
        };

        const resultat = skalMeldingBehandles(melding);
        const forventetResultat = false;

        expect(resultat).toEqual(forventetResultat);
    });

    it('returnerer FALSE dersom det er svart JA til smp 5 og periodeTil pluss 14 dager er i FORTIDEN', () => {
        const melding: MeldekortMelding = {
            fnr: '12345678910',
            arbeidssokerNestePeriode: true,
            periodeFra: '2021-11-28',
            periodeTil: '2021-12-11',
            kortType: 'ELEKTRONISK',
            opprettet: '2021-12-12',
        };

        const resultat = skalMeldingBehandles(melding);
        const forventetResultat = false;

        expect(resultat).toEqual(forventetResultat);
    });

    it('returnerer TRUE dersom det er svart JA til spm 5 og periodeTil pluss 14 dager er i FREMTIDEN', () => {
        const iDag = new Date();
        const iDagStreng = iDag.toISOString().substring(0, 10);
        const periodeFra = plussDager(iDag, -7).toISOString().substring(0, 10);
        const melding: MeldekortMelding = {
            fnr: '12345678910',
            arbeidssokerNestePeriode: true,
            periodeFra,
            periodeTil: iDagStreng,
            kortType: 'ELEKTRONISK',
            opprettet: iDagStreng,
        };

        const resultat = skalMeldingBehandles(melding);
        const forventetResultat = true;

        expect(resultat).toEqual(forventetResultat);
    });
});
