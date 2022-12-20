import beregnArbeidssokerperioder, { Periode } from './arbeidssokerperioder';

function kanArbeidssokerenReaktiveres(arbeidssokerperioder: Periode[]): boolean {
    const { harAktivArbeidssokerperiode, antallDagerSidenSisteArbeidssokerperiode } =
        beregnArbeidssokerperioder(arbeidssokerperioder);
    const erInnenfor28dager = antallDagerSidenSisteArbeidssokerperiode < 28;

    return !harAktivArbeidssokerperiode && erInnenfor28dager;
}

export default kanArbeidssokerenReaktiveres;
