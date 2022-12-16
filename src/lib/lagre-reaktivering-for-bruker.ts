import fetchData from '../fetch-data';
import config from '../config';
import getAzureAdToken from '../auth';

const lagreReaktiveringForBruker = async (fnr: string) => {
    return fetchData(
        `${config.AIA_BACKEND_URL}/azure/automatisk-reaktivering`,
        await getAzureAdToken(config.AIA_BACKEND_SCOPE),
        JSON.stringify({ fnr })
    );
};

export default lagreReaktiveringForBruker;
