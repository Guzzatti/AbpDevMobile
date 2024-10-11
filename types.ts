export type Event = {
    id: string;
    title: string;
    description: string;
    date: string; // Formato de data
    time: string; // Formato de hora
    latitude: number;
    longitude: number;
    // Adicione outras propriedades que possam ser necessárias
    images?: string[]; // Array de URLs de imagens
};
