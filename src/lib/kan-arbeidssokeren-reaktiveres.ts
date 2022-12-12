import { beregnArbeidssokerperioder, Periode } from './arbeidssokerperioder';

interface Props {
    arbeidssokerperioder: [] | Periode[];
}

function kanArbeidssokerenReaktiveres(props: Props): boolean {
    const { arbeidssokerperioder } = props;
    const beregnedeArbeidssokerPerioder = beregnArbeidssokerperioder({ arbeidssokerperioder });
    const harIkkeAktivPeriode = beregnedeArbeidssokerPerioder.harAktivArbeidssokerperiode === 'Nei';
    const erInnenfor28dager = beregnedeArbeidssokerPerioder.antallDagerSidenSisteArbeidssokerperiode < 28;
    return harIkkeAktivPeriode && erInnenfor28dager;
}

export { kanArbeidssokerenReaktiveres };
