import moment from 'moment';

//use for npm start
import requests from "./resources/requests.json" assert {type: "json"};
import rooms from "./resources/rooms.json"  assert {type: "json"};
import reservations from "./resources/reservations.json"  assert {type: "json"};

//use for npm test
// const requests = require('./resources/requests.json')
// const rooms = require('./resources/rooms.json')
// const reservations = require('./resources/reservations.json')

interface Request { id: string; min_beds: number; is_smoker: boolean; checkin_date: string; checkout_date: string; }
interface Room { id: string; num_beds: number; allow_smoking: boolean; daily_rate: number; cleaning_fee: number; }
interface Reservation { room_id: string; checkin_date: string; checkout_date: string; total_charge: number; }

export { createNewReservation
  ,findAvailableRooms
  ,calculatePrice
  ,updateReservations
  ,smoking 
  ,beds 
  ,isOverlapping 
  ,notBooked 
};

createNewReservation()

function createNewReservation() {
  requests.forEach((request: any) => {

    let availableRooms = findAvailableRooms(request, rooms, reservations);

    let cheapestRoom = availableRooms.map(room => {
      const price = calculatePrice(room, request);

      return {
        price,
        ...room
      };
    }).reduce((previous: Room & { price: number; }, current: Room & { price: number; }) => current.price < previous.price ? current : previous);
    updateReservations(request, cheapestRoom);

  });
  console.log('reservations::',reservations)
}

function findAvailableRooms(request: Request, rooms: Room[], reservations: Reservation[]): Room[]{
  return rooms.filter(room =>
    smoking(room, request) &&
    beds(room, request) &&
    notBooked(room, request, reservations)
  )
}

function calculatePrice(room: Room, request: Request): number {

  const a = moment(request.checkin_date);
  const b = moment(request.checkout_date);
  const diff = b.diff(a, 'days')
  const total_price = (room.daily_rate * diff) + room.cleaning_fee ; 

  return total_price;
}

function updateReservations(request: Request, cheapestRoom: Room & { price: number }) {
  const newReservation = {
    room_id: cheapestRoom.id,
    checkin_date: request.checkin_date,
    checkout_date: request.checkout_date,
    total_charge: cheapestRoom.price
  }

  reservations.push(newReservation)

  console.log('reservations.length::', reservations.length);
  
  return newReservation
}

function smoking(room: Room, request: Request): boolean {
  return room.allow_smoking == request.is_smoker
}

function beds(room: Room, request: Request): boolean {
  return room.num_beds >= request.min_beds
}

function isOverlapping(startDate1: string, endDate1: string, startDate2: string, endDate2: string){ 

  return moment(startDate1).isSameOrBefore(endDate2) && moment(startDate2).isSameOrBefore(endDate1);

}

function notBooked(room: Room, request: Request, reservations: Reservation[]): boolean {
  return !reservations.some(reservation => 
    reservation.room_id === room.id  && 
    isOverlapping(request.checkin_date, request.checkout_date, reservation.checkin_date, reservation.checkout_date)
  )

}

// console.timeEnd("runReserve")
