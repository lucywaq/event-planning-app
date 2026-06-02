let events = JSON.parse(localStorage.getItem("events")) || [];
let vendors = JSON.parse(localStorage.getItem("vendors")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let messages = JSON.parse(localStorage.getItem("messages")) || [];
let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

function showSection(id){
document.querySelectorAll('.section').forEach(section=>{
section.classList.remove('active');
});

document.getElementById(id).classList.add('active');
}

function createEvent(){

const name = document.getElementById('eventName').value;
const date = document.getElementById('eventDate').value;

if(name === "" || date === ""){
alert("Fill all fields");
return;
}

events.push({name,date});

localStorage.setItem("events",JSON.stringify(events));

addNotification("New event created: " + name);

renderEvents();
updateDashboard();
}

function renderEvents(){

const list = document.getElementById('eventList');

list.innerHTML = "";

events.forEach(event=>{
list.innerHTML += `
<li>
${event.name} - ${event.date}
</li>
`;
});
}

function addVendor(){

const name = document.getElementById('vendorName').value;
const service = document.getElementById('vendorService').value;

if(name === "" || service === ""){
alert("Fill all fields");
return;
}

vendors.push({name,service});

localStorage.setItem("vendors",JSON.stringify(vendors));

addNotification("Vendor added: " + name);

renderVendors();
updateDashboard();
}

function renderVendors(){

const list = document.getElementById('vendorList');

list.innerHTML = "";

vendors.forEach(vendor=>{

list.innerHTML += `
<div class="vendor-card">
<h3>${vendor.name}</h3>
<p>${vendor.service}</p>
</div>
`;
});
}

function addTicket(){

const ticket = document.getElementById('ticketName').value;

if(ticket === ""){
alert("Enter ticket name");
return;
}

tickets.push(ticket);

localStorage.setItem("tickets",JSON.stringify(tickets));

addNotification("Ticket added");

renderTickets();
updateDashboard();
}

function renderTickets(){

const list = document.getElementById('ticketList');

list.innerHTML = "";

tickets.forEach(ticket=>{
list.innerHTML += `<li>${ticket}</li>`;
});
}

function sendMessage(){

const msg = document.getElementById('messageText').value;

if(msg === ""){
alert("Type a message");
return;
}

messages.push(msg);

localStorage.setItem("messages",JSON.stringify(messages));

addNotification("New message sent");

renderMessages();
}

function renderMessages(){

const list = document.getElementById('messageList');

list.innerHTML = "";

messages.forEach(msg=>{

list.innerHTML += `
<div class="message">
${msg}
</div>
`;
});
}

function addNotification(text){

notifications.push(text);

localStorage.setItem(
"notifications",
JSON.stringify(notifications)
);

renderNotifications();
}

function renderNotifications(){

const list = document.getElementById('notificationList');

list.innerHTML = "";

notifications.forEach(note=>{
list.innerHTML += `<li>${note}</li>`;
});
}

function updateDashboard(){

document.getElementById('eventCount').innerText = events.length;
document.getElementById('vendorCount').innerText = vendors.length;
document.getElementById('ticketCount').innerText = tickets.length;
}

renderEvents();
renderVendors();
renderTickets();
renderMessages();
renderNotifications();
updateDashboard();