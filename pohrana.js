import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DATOTEKA = join(process.cwd(), "zadaci.json");

export async function ucitajZadatke() {
    let tekst;
    try {
        tekst = await readFile(DATOTEKA, "utf-8");
    } catch (error) {
        if (error.code === "ENOENT") {
            return []; // datoteka ne postoji => prazan popis
        }
        throw new Error(`Datoteku zadaci.json nije moguće pročitati: ${error.message}`);
    }

    let zadaci;
    try {
        zadaci = JSON.parse(tekst); // deserijalizacija: tekst => objekt
    } catch (error) {
        throw new Error(`Datoteka zadaci.json nije ispravna: ${error.message}`);
    }

    if (!Array.isArray(zadaci)) {
        throw new Error("Datoteka zadaci.json nije ispravna: očekivano je polje zadataka.");
    }
    return zadaci;
}

export async function spremiZadatke(zadaci) {
    try {
        await writeFile(DATOTEKA, JSON.stringify(zadaci, null, 2)); // serijalizacija: objekt => tekst
    } catch (error) {
        throw new Error(`Spremanje u zadaci.json nije uspjelo: ${error.message}`);
    }
}
