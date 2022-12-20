import { MeldekortMelding } from '../types/meldekort-melding';
import plussDager from './plussdager';

function skalMeldingBehandles(melding: MeldekortMelding): boolean {
    const { arbeidssokerNestePeriode: erArbeidssokerNestePeriode, periodeTil } = melding;
    const iDag = new Date();
    const bekreftetPeriodeDato = plussDager(new Date(periodeTil), 14);

    const bekreftetPeriodeErFremItid = iDag < bekreftetPeriodeDato;

    return erArbeidssokerNestePeriode && bekreftetPeriodeErFremItid;
}

export default skalMeldingBehandles;
