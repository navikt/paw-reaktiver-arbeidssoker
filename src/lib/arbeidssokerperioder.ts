import dagerFraDato from './dager-fra-dato';

export interface BeregnedePerioder {
    harAktivArbeidssokerperiode: 'Ja' | 'Nei';
    antallDagerSidenSisteArbeidssokerperiode: number | 'Ikke avsluttet';
}

export interface Periode {
    fraOgMedDato: string;
    tilOgMedDato?: string | null;
}

function sorterArbeidssokerperioderSisteForst(a: Periode, b: Periode) {
    const delta = new Date(b.fraOgMedDato).getTime() - new Date(a.fraOgMedDato).getTime();
    if (delta === 0) {
        if (b.tilOgMedDato === null) {
            return 1;
        } else if (a.tilOgMedDato === null) {
            return -1;
        }
    }
    return delta;
}

function harAktivArbeidssokerperiode(perioder: Periode[]) {
    return perioder.some((periode) => periode.tilOgMedDato === null);
}

function beregnAntallDagerSidenSisteArbeidssokerperiode(dato: string | null) {
    return dagerFraDato(dato ? new Date(dato) : new Date());
}

function beregnArbeidssokerperioder(arbeidssokerperioder: Periode[]): BeregnedePerioder {
    arbeidssokerperioder.sort(sorterArbeidssokerperioderSisteForst);

    const aktivArbeidssokerperiode = harAktivArbeidssokerperiode(arbeidssokerperioder);
    const sluttDatoSistePeriode = arbeidssokerperioder[0].tilOgMedDato ?? null;

    return {
        harAktivArbeidssokerperiode: aktivArbeidssokerperiode ? 'Ja' : 'Nei',
        antallDagerSidenSisteArbeidssokerperiode: aktivArbeidssokerperiode
            ? 'Ikke avsluttet'
            : beregnAntallDagerSidenSisteArbeidssokerperiode(sluttDatoSistePeriode),
    };
}

export default beregnArbeidssokerperioder;
