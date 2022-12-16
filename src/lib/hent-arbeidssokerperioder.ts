import fetchData from '../fetch-data';
import config from '../config';
import getAzureAdToken from '../auth';

const hentArbeidssokerperioder = async (fnr: string) => {
    return fetchData(
        `${config.VEILARBREGISTRERING_GCP_URL}/api/arbeidssoker/perioder?fraOgMed=2020-01-01`,
        await getAzureAdToken(config.VEILARBREGISTRERING_GCP_SCOPE),
        JSON.stringify({ fnr })
    );
};

export default hentArbeidssokerperioder;
