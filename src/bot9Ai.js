
async function getRoomDetails() {
    const response = await fetch('https://bot9assignement.deno.dev/rooms');
    const data = await response.json();
    return data;
}



