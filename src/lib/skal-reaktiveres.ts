import fetchData from '../fetch-data';
import config from '../config';
import getAzureAdToken from '../auth';

type Response = {
    kanReaktiveres: boolean;
};

export default async function skalReaktiveres(fnr: string): Promise<Response> {
    return fetchData(
        `${config.VEILARBREGISTRERING_GCP_URL}/api/kan-reaktiveres`,
        await getAzureAdToken(config.VEILARBREGISTRERING_GCP_SCOPE),
        JSON.stringify({ fnr })
    );
}
