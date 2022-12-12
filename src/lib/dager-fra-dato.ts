export function dagerFraDato(fra: Date, til?: Date): number {
    const todate = til || new Date();
    const start = new Date(fra.toISOString().substring(0, 10));
    const end = new Date(todate.toISOString().substring(0, 10));
    const millis = end.getTime() - start.getTime();
    const days = millis / 3600000 / 24;
    return Math.floor(days);
}
