import { fetchData } from '../http';
import config from '../config';
import { getAiaBackendToken } from '../auth';

const lagreReaktiveringForBruker = async (fnr: string) => {
    return fetchData(
        `${config.AIA_BACKEND_URL}/azure/automatisk-reaktivering`,
        await getAiaBackendToken(),
        JSON.stringify({ fnr })
    );
};

export default lagreReaktiveringForBruker;
