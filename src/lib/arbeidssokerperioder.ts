import { dagerFraDato } from './dager-fra-dato';

export interface BeregnedePerioder {
    harAktivArbeidssokerperiode: 'INGEN_DATA' | 'N/A' | 'Ja' | 'Nei';
    antallDagerSidenSisteArbeidssokerperiode: number | 'Ikke avsluttet' | 'INGEN_DATA' | 'N/A';
}

export interface Periode {
    fraOgMedDato: string;
    tilOgMedDato?: string | null;
}

interface Props {
    arbeidssokerperioder: [] | Periode[];
}

function sorterArbeidssokerperioderSisteForst(a: Periode, b: Periode) {
    return new Date(b.fraOgMedDato).getTime() - new Date(a.fraOgMedDato).getTime();
}

function harAktivArbeidssokerperiode(perioder: Periode[]) {
    const sistePeriode = perioder[0];
    return sistePeriode.tilOgMedDato === null || sistePeriode.tilOgMedDato === undefined;
}

function beregnAntallDagerSidenSisteArbeidssokerperiode(dato: string | null) {
    return dagerFraDato(dato ? new Date(dato) : new Date());
}

function beregnArbeidssokerperioder(props: Props | null | undefined): BeregnedePerioder {
    const { arbeidssokerperioder } = props ? props : { arbeidssokerperioder: null };

    if (arbeidssokerperioder === null) {
        return {
            harAktivArbeidssokerperiode: 'INGEN_DATA',
            antallDagerSidenSisteArbeidssokerperiode: 'INGEN_DATA',
        };
    }

    if (arbeidssokerperioder.length === 0) {
        return {
            harAktivArbeidssokerperiode: 'N/A',
            antallDagerSidenSisteArbeidssokerperiode: 'N/A',
        };
    }

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

export { beregnArbeidssokerperioder };
