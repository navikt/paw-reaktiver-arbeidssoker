import { getVeilarbregistreringToken } from '../auth';
import { fetchData } from '../http';
import config from '../config';

const reaktiverBruker = async (fnr: string) => {
    return fetchData(
        `${config.VEILARBREGISTRERING_GCP_URL}/api/fullfoerreaktivering/systembruker`,
        await getVeilarbregistreringToken(),
        JSON.stringify({ fnr })
    );
};

export default reaktiverBruker;
