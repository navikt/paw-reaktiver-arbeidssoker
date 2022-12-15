import config from './config';
import { getAiaBackendToken } from './auth';
import { fetchData } from './http';
import logger from './logger';

(async () => {
    const aiaBackendToken = await getAiaBackendToken();
    logger.info(`Hentet token ${aiaBackendToken}`);

    const data = await fetchData(
        `${config.AIA_BACKEND_URL}/azure/automatisk-reaktivering`,
        aiaBackendToken!,
        JSON.stringify({
            fnr: '09837398611',
        })
    );
    logger.info(data);
})();
