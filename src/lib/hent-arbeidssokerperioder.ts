import { fetchData } from '../http';
import config from '../config';
import { getVeilarbregistreringToken } from '../auth';

const hentArbeidssokerperioder = async (fnr: string) => {
    return fetchData(
        `${config.VEILARBREGISTRERING_URL}/api/arbeidssoker/perioder?fraOgMed=2020-01-01`,
        await getVeilarbregistreringToken(),
        JSON.stringify({ fnr })
    );
};

export default hentArbeidssokerperioder;
