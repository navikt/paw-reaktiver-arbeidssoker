import logger from '../logger';

import skalMeldingBehandles from './skal-melding-behandles';
import hentArbeidssokerperioder from './hent-arbeidssokerperioder';
import kanArbeidssokerenReaktiveres from './kan-arbeidssokeren-reaktiveres';
// import reaktiverBruker from './reaktiver-bruker';
// import lagreReaktiveringForBruker from './lagre-reaktivering-for-bruker';
import { MeldekortMelding } from '../types/meldekort-melding';
import { callId } from './call-id-provider';

export default async function (meldekortMelding: MeldekortMelding, offset: string) {
    // Midlertidig hopp ut for å komme up2date med offset
    logger.info(`Melding med offset: ${offset}`);
    if (offset) {
        return;
    }

    const skalBehandles = skalMeldingBehandles(meldekortMelding);
    if (!skalBehandles) {
        logger.info({ callId, message: `Meldingen med offset - ${offset} - skal ikke behandles` });
        return;
    }

    logger.info({ callId, message: `Behandler meldingen med offset - ${offset}` });

    const { fnr } = meldekortMelding;

    try {
        logger.info({ callId, message: `Henter arbeidssokerperioder for bruker - offset ${offset}` });
        const { arbeidssokerperioder } = await hentArbeidssokerperioder(fnr);
        if (!arbeidssokerperioder || arbeidssokerperioder.length === 0) {
            logger.info({ callId, message: `Ingen arbeidssokerperioder funnet - offset ${offset}` });
            return;
        }

        logger.info({
            callId,
            message: `${arbeidssokerperioder.length} arbeidssokerperioder funnet - offset ${offset}`,
        });

        if (!kanArbeidssokerenReaktiveres(arbeidssokerperioder)) {
            logger.info({
                callId,
                message: `Bruker kan ikke reaktiveres, enten fordi det finnes en aktiv arbeidsøkerperiode eller fordi det er over 28 dager siden siste arbeidssøkerperiode - offset ${offset}`,
            });
            return;
        }

        // logger.info({ callId, message: `Forsøker å reaktivere bruker - offset ${offset}` });
        // await reaktiverBruker(fnr);

        // logger.info({ callId, message: `Forsøker å lagre reaktivering for bruker - offset ${offset}` });
        // await lagreReaktiveringForBruker(fnr);
    } catch (error) {
        const err = error as Error;
        logger.error({ err, callId }, `Feil ved reaktivering av bruker: ${err.message}`);
    }
}
