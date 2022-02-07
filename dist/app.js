import moment from 'moment';
import requests from "./requests.json" assert { type: "json" };
import rooms from "./rooms.json" assert { type: "json" };
import reservations from "./reservations.json" assert { type: "json" };
requests.forEach(request => {
    let availableRooms = findAvailableRooms(request, rooms, reservations);
    let cheapestRoom = availableRooms.map(room => {
        const price = calculatePrice(room, request);
        return {
            price,
            ...room
        };
    }).reduce((previous, current) => current.price < previous.price ? current : previous);
    // console.log('1st request.id, cheapestRoom, availableRooms::', request.id, cheapestRoom, availableRooms);
    updateReservations(request, cheapestRoom);
});
function findAvailableRooms(request, rooms, reservations) {
    return rooms.filter(room => smoking(room, request) &&
        beds(room, request) &&
        booked(room, request, reservations));
}
function calculatePrice(room, request) {
    const a = moment(request.checkin_date);
    const b = moment(request.checkout_date);
    const diff = b.diff(a, 'days');
    const total_price = (room.daily_rate * diff) + room.cleaning_fee;
    return total_price;
    return 75;
}
function updateReservations(request, cheapestRoom) {
    const newReservation = {
        room_id: cheapestRoom.id,
        checkin_date: request.checkin_date,
        checkout_date: request.checkout_date,
        total_charge: cheapestRoom.price
    };
    reservations.push(newReservation);
}
function smoking(room, request) {
    return room.allow_smoking == request.is_smoker;
}
function beds(room, request) {
    return room.num_beds >= request.min_beds;
}
function isOverlapping(startDate1, endDate1, startDate2, endDate2) {
    return moment(startDate1).isSameOrBefore(endDate2) &&
        moment(startDate2).isSameOrBefore(endDate1);
}
function booked(room, request, reservations) {
    return !reservations.some(reservation => {
        reservation.room_id === room.id &&
            isOverlapping(request.checkin_date, request.checkout_date, reservation.checkin_date, reservation.checkout_date);
        // &&
        // new Date(reservation.checkout_date) >= new Date(request.checkin_date) ||
        // new Date(reservation.checkin_date) <= new Date(request.checkout_date)
    });
}
console.log(reservations);
//# sourceMappingURL=app.js.map