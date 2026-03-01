import type { AthleteRow } from "./types";

// ── Test data ───────────────────────────────────────────────────────────
export const generateTestData = (): AthleteRow[] => [
    { id: 1,  athlete: "Michael Phelps",   country: "United States", sport: "Swimming",    gold: 8, silver: 0, bronze: 0 },
    { id: 2,  athlete: "Usain Bolt",        country: "Jamaica",        sport: "Athletics",   gold: 3, silver: 0, bronze: 0 },
    { id: 3,  athlete: "Simone Biles",      country: "United States", sport: "Gymnastics",  gold: 4, silver: 1, bronze: 2 },
    { id: 4,  athlete: "Mo Farah",          country: "Great Britain",  sport: "Athletics",   gold: 2, silver: 0, bronze: 0 },
    { id: 5,  athlete: "Katie Ledecky",     country: "United States", sport: "Swimming",    gold: 5, silver: 1, bronze: 0 },
    { id: 6,  athlete: "Nadia Comaneci",    country: "Romania",        sport: "Gymnastics",  gold: 5, silver: 3, bronze: 1 },
    { id: 7,  athlete: "Carl Lewis",        country: "United States", sport: "Athletics",   gold: 9, silver: 1, bronze: 0 },
    { id: 8,  athlete: "Ian Thorpe",        country: "Australia",      sport: "Swimming",    gold: 5, silver: 3, bronze: 1 },
    { id: 9,  athlete: "Neeraj Chopra",     country: "India",          sport: "Athletics",   gold: 1, silver: 0, bronze: 0 },
    { id: 10, athlete: "Kohei Uchimura",    country: "Japan",          sport: "Gymnastics",  gold: 3, silver: 4, bronze: 0 },
];
