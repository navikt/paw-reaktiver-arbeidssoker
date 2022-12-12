import { beregnArbeidssokerperioder, Periode } from './arbeidssokerperioder';

interface Props {
    arbeidssokerperioder: [] | Periode[];
}

function kanArbeidssokerenReaktiveres(props: Props): boolean {
    const { arbeidssokerperioder } = props;
    const beregnedeArbeidssokerPerioder = beregnArbeidssokerperioder({ arbeidssokerperioder: arbeidssokerperioder });
    const erInaktivert = beregnedeArbeidssokerPerioder.harAktivArbeidssokerperiode === 'Nei';
    const erInnenfor28dager = beregnedeArbeidssokerPerioder.antallDagerSidenSisteArbeidssokerperiode < 28;
    return erInaktivert && erInnenfor28dager;
}

export { kanArbeidssokerenReaktiveres };
