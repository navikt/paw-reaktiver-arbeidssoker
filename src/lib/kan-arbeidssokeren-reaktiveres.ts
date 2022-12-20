import beregnArbeidssokerperioder, { Periode } from './arbeidssokerperioder';

function kanArbeidssokerenReaktiveres(arbeidssokerperioder: Periode[]): boolean {
    const beregnedeArbeidssokerPerioder = beregnArbeidssokerperioder({ arbeidssokerperioder });
    const harIkkeAktivPeriode = beregnedeArbeidssokerPerioder.harAktivArbeidssokerperiode === 'Nei';
    const erInnenfor28dager = beregnedeArbeidssokerPerioder.antallDagerSidenSisteArbeidssokerperiode < 28;
    return harIkkeAktivPeriode && erInnenfor28dager;
}

export default kanArbeidssokerenReaktiveres;
