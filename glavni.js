import { ucitajZadatke, spremiZadatke } from "./pohrana.js";

function pogreska(poruka) {
    console.error(poruka);
    process.exit(1);
}

const [naredba, ...argumenti] = process.argv.slice(2);
//      ^destrukturiranje polja

let zadaci;
try {
    zadaci = await ucitajZadatke();
} catch (error) {
    pogreska(error.message);
}

switch (naredba) {
    case "dodaj": {
        const naslov = argumenti.join(" ").trim();
        if (naslov === "") {
            pogreska('Korištenje: dodaj "naslov zadatka"');
        }

        const noviId = zadaci.length === 0 ? 1 : Math.max(...zadaci.map((z) => z.id)) + 1;
        zadaci.push({ id: noviId, naslov, gotovo: false });

        try {
            await spremiZadatke(zadaci);
        } catch (error) {
            pogreska(error.message);
        }
        console.log(`Dodano: ${naslov} (id: ${noviId})`);
        break;
    }

    case "popis":
        if (zadaci.length === 0) {
            console.log("Nema zadataka.");
        } else {
            for (const { id, naslov, gotovo } of zadaci) {
                console.log(`${id}. [${gotovo ? "x" : " "}] ${naslov}`);
            }
        }
        break;

    case "gotovo": {
        const id = Number(argumenti[0]);
        if (argumenti[0] === undefined || !Number.isInteger(id)) {
            pogreska("Korištenje: gotovo broj_zadatka (broj mora biti cijeli broj)");
        }

        const zadatak = zadaci.find((z) => z.id === id);
        if (zadatak === undefined) {
            pogreska(`Zadatak s brojem ${id} ne postoji.`);
        }

        zadatak.gotovo = true;
        try {
            await spremiZadatke(zadaci);
        } catch (error) {
            pogreska(error.message);
        }
        console.log(`Zadatak ${id} označen kao gotov.`);
        break;
    }

    default:
        pogreska("Nepoznata naredba. Koristi: dodaj, popis, gotovo.");
}
