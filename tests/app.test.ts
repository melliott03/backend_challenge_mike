import moment from 'moment';

// import requests from "../resources/requests.json" ;
// import rooms from "../resources/rooms.json" ;
// import reservations from "../resources/reservations.json" ;

const App = require('../app')
interface Request { id: string; min_beds: number; is_smoker: boolean; checkin_date: string; checkout_date: string; }
interface Room { id: string; num_beds: number; allow_smoking: boolean; daily_rate: number; cleaning_fee: number; }
interface Reservation { room_id: string; checkin_date: string; checkout_date: string; total_charge: number; }

const room: Room = {
    id: '91754a14-4885-4200-a052-e4042431ffb8',
    num_beds: 1,
    allow_smoking: true,
    daily_rate: 30,
    cleaning_fee: 10
}
const rooms: Array<Room> = [room]

const reservations: Array<Reservation> = [{
    room_id : '91754a14-4885-4200-a052-e4042431ffb8',
    checkin_date: '2021-01-01',
    checkout_date: '2021-01-02',
    total_charge: 130
}]
const request: Request = {
    id: '4067b75d-c74e-4313-9fa9-ece076a03eed',
    min_beds: 1,
    is_smoker: true,
    checkin_date: '2021-01-04',
    checkout_date: '2021-01-05'
}
const request2: Request = {
    id: '4067b75d-c74e-4313-9fa9-ece076a03eed',
    min_beds: 2,
    is_smoker: false,
    checkin_date: '2021-01-01',
    checkout_date: '2021-01-02'
}

const a = moment(request.checkin_date);
const b = moment(request.checkout_date);
const diff = b.diff(a, 'days')         
const TOTAL_PRICE = (room.daily_rate * diff) + room.cleaning_fee ;  

describe('createNewReservation', function() {
    describe('notBooked', function() {
        test('it returns true if the room is not booked', ()=> {   
            expect(App.notBooked(room, request, reservations)).toBe(true)
        })
        test('it returns false if the room is booked', ()=> {   
            expect(App.notBooked(room, request2, reservations)).toEqual(false)
        })
    })

    describe('isOverlapping', function() {
        test('it returns false if dates do not overlap', ()=> {   
            const startDate1 = request.checkin_date, endDate1 = request.checkout_date, startDate2 = reservations[0].checkin_date, endDate2 = reservations[0].checkout_date

            expect(App.isOverlapping(startDate1, endDate1, startDate2, endDate2)).toEqual(false)
        })
        test('it returns true if dates overlap', ()=> { 
            const startDate1 = request2.checkin_date, endDate1 = request2.checkout_date, startDate2 = reservations[0].checkin_date, endDate2 = reservations[0].checkout_date
  
            expect(App.isOverlapping(startDate1, endDate1, startDate2, endDate2)).toEqual(true)
        })
    })

    describe('beds', function() {
        test('It should return true room has  enough beds for the request', ()=> {   
            expect(App.beds(room, request)).toEqual(true)
        })
        test('It should return false room does not have enough beds for the request', ()=> { 
            expect(App.beds(room, request2)).toEqual(false)
        })
    })

    describe('smoking', function() {
        test('It should return true room matches request smoking requirement', ()=> {   
            expect(App.beds(room, request)).toEqual(true)
        })
        test('It should return true room does not match request smoking requirement', ()=> { 
            expect(App.beds(room, request2)).toEqual(false)
        })
    })

    describe('updateReservations', function() {
        test('It should return the reservation with dates matching the request', ()=> {   
            
            expect(App.updateReservations( request, room )).toEqual(expect.objectContaining({
                checkin_date: expect.stringMatching(request.checkin_date),
                checkout_date: expect.stringMatching(request.checkout_date),
                room_id: expect.stringMatching(room.id)
              
              }))
        })
        // write failing test
    })

    describe('calculatePrice', function() {
        test('It should return the total price of the room', ()=> {    
            
            expect(App.calculatePrice( room, request )).toEqual(TOTAL_PRICE)
        })
        //write failing test
    })

    describe('findAvailableRooms', function() {
        test('It should return the available rooms for a request', ()=> {    
             
            expect(App.findAvailableRooms( request, rooms, reservations )).toEqual(rooms)
        })
        //write failing test
    })



  })


