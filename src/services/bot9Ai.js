require('dotenv').config();

async function getRooms() {
    const response = await fetch(process.env.URL_LINK + '/rooms');
    const data = await response.json();
    const roomDetails = data;
    return roomDetails;
    // Returns promise
}

async function getRoomDetails (){
    try{
        const a = await getRooms();
        console.log("Rooms fetched successfully!");
        const response = `
            Here are the available rooms:
            ${a}
        `
        return response;
    }
    catch(e){
        console.log("Error in getRoomDetails")
        console.log(e);
    }
}

async function bookRoom(roomId, fullName, email, nights) {
    const response = await fetch(process.env.URL_LINK + '/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: roomId,
            fullName: fullName,
            email: email,
            nights: nights
        })
    });
    const data = await response.json();
    return data;
    // Returns promise
}

async function postRoomDetails(roomId, fullName, email, nights) {
    try {
        const a = await bookRoom(roomId, fullName, email, nights);
        console.log("Room booked successfully!");

        const response = `
            Your room has been booked successfully! Here are the details:
            Booking ID: ${a.bookingId}
            Room Name: ${a.roomName}
            Full Name: ${a.fullName}
            Email: ${a.email}
            Total Nights: ${a.nights}
            Total Price: ${a.price}
        `
        return response;
    }
    catch (e) {
        console.log("Error in postRoomDetails")
        console.log(e);
    }
}


module.exports = { getRoomDetails, postRoomDetails};