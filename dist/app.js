import moment from 'moment';
//use for npm start
import requests from "./resources/requests.json" assert { type: "json" };
import rooms from "./resources/rooms.json" assert { type: "json" };
import reservations from "./resources/reservations.json" assert { type: "json" };
export { createNewReservation, findAvailableRooms, calculatePrice, updateReservations, smoking, beds, isOverlapping, notBooked };
createNewReservation();
function createNewReservation() {
    requests.forEach((request) => {
        let availableRooms = findAvailableRooms(request, rooms, reservations);
        let cheapestRoom = availableRooms.map(room => {
            const price = calculatePrice(room, request);
            return {
                price,
                ...room
            };
        }).reduce((previous, current) => current.price < previous.price ? current : previous);
        updateReservations(request, cheapestRoom);
    });
    console.log('reservations::', reservations);
}
function findAvailableRooms(request, rooms, reservations) {
    return rooms.filter(room => smoking(room, request) &&
        beds(room, request) &&
        notBooked(room, request, reservations));
}
function calculatePrice(room, request) {
    const a = moment(request.checkin_date);
    const b = moment(request.checkout_date);
    const diff = b.diff(a, 'days');
    const total_price = (room.daily_rate * diff) + room.cleaning_fee;
    return total_price;
}
function updateReservations(request, cheapestRoom) {
    const newReservation = {
        room_id: cheapestRoom.id,
        checkin_date: request.checkin_date,
        checkout_date: request.checkout_date,
        total_charge: cheapestRoom.price
    };
    reservations.push(newReservation);
    console.log('reservations.length::', reservations.length);
    return newReservation;
}
function smoking(room, request) {
    return room.allow_smoking == request.is_smoker;
}
function beds(room, request) {
    return room.num_beds >= request.min_beds;
}
function isOverlapping(startDate1, endDate1, startDate2, endDate2) {
    return moment(startDate1).isSameOrBefore(endDate2) && moment(startDate2).isSameOrBefore(endDate1);
}
function notBooked(room, request, reservations) {
    return !reservations.some(reservation => reservation.room_id === room.id &&
        isOverlapping(request.checkin_date, request.checkout_date, reservation.checkin_date, reservation.checkout_date));
}
// console.log('reservations::', reservations)
// console.timeEnd("runReserve")
// console.log("requests.length", requests.length)
//# sourceMappingURL=app.js.map