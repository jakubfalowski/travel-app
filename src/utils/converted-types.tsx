export type ConvertedFlightData = {
  id: number;
  price: number[]; // Zawiera jednostki ceny
  baggagePrice: number[]; // Zawiera jednostki ceny za bagaż
  departureAirport1: string[]; // Zawiera nazwę lotniska odlotu dla segmentu 1
  arrivalAirport1: string[]; // Zawiera nazwę lotniska przybycia dla segmentu 1
  departureTime1: string[]; // Zawiera czas odlotu dla segmentu 1
  arrivalTime1: string[]; // Zawiera czas przybycia dla segmentu 1
  flightDuration1: string[]; // Zawiera czas trwania lotu dla segmentu 1
  departureAirport2: string[]; // Zawiera nazwę lotniska odlotu dla segmentu 2
  arrivalAirport2: string[]; // Zawiera nazwę lotniska przybycia dla segmentu 2
  departureTime2: string[]; // Zawiera czas odlotu dla segmentu 2
  arrivalTime2: string[]; // Zawiera czas przybycia dla segmentu 2
  flightDuration2: string[]; // Zawiera czas trwania lotu dla segmentu 2
};

export type ConvertedHotelData = {
  id: number;
  description: string[]; // Opis hotelu
  name: string[]; // Nazwa hotelu
  latitude: number[]; // Szerokość geograficzna hotelu
  longitude: number[]; // Długość geograficzna hotelu
  reviewCount: number[]; // Liczba recenzji hotelu
  reviewScore: number[]; // Ocena hotelu
  price: number[]; // Cena hotelu
  imageUrl: string[]; // URL zdjęcia hotelu
  cityId: string[]; // Identyfikator miasta
  cityName: string[]; // Nazwa miasta
};
