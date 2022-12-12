export function plussDager(dato: Date, antallDager: number) {
    const kopi = new Date(dato);
    kopi.setDate(kopi.getDate() + antallDager);
    return kopi;
}
