import { Melding } from '../types/melding';
import { plussDager } from './plussdager';

function skalMeldingBehandles(melding: Melding): boolean {
    const { arbeidssokerNestePeriode: erArbeidssokerNestePeriode, periodeTil } = melding;
    const iDag = new Date();
    const bekreftetPeriodeDato = plussDager(new Date(periodeTil), 14);

    const bekreftetPeriodeErFremItid = iDag < bekreftetPeriodeDato;

    return erArbeidssokerNestePeriode && bekreftetPeriodeErFremItid;
}

export { skalMeldingBehandles };
