import fetchData from '../fetch-data';
import config from '../config';
import getAzureAdToken from '../auth';

async function reaktiverBruker(fnr: string) {
    return fetchData(
        `${config.VEILARBREGISTRERING_URL}/api/fullfoerreaktivering/systembruker`,
        await getAzureAdToken(config.PAW_PROXY_SCOPE),
        JSON.stringify({ fnr })
    );
}

export default reaktiverBruker;
