document.addEventListener('DOMContentLoaded', () => {
    
    // 1. TICKET BOOKING FLOW & QR GENERATION (Details Page)
    const buyTicketBtn = document.getElementById('buy-ticket-btn');
    const ticketModal = document.getElementById('ticket-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (buyTicketBtn && ticketModal && closeModalBtn) {
        buyTicketBtn.addEventListener('click', () => {
            // Simulates real-time secure ticket generation upon clicking buy/pay
            const ticketUUID = "JAM-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
            const uuidElement = document.getElementById('det-ticket-uuid');
            if (uuidElement) {
                uuidElement.textContent = `Voucher ID: ${ticketUUID}`;
            }
            ticketModal.style.display = 'flex';
        });

        closeModalBtn.addEventListener('click', () => {
            ticketModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === ticketModal) {
                ticketModal.style.display = 'none';
            }
        });
    }

    // 2. HERO SEARCH FUNCTIONALITY (Homepage)
    const searchBtn = document.getElementById('home-search-btn');
    const searchInput = document.getElementById('home-search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            executeSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearch(searchInput.value);
            }
        });
    }

    function executeSearch(query) {
        if (!query.trim()) {
            alert('Please enter a keyword to search.');
            return;
        }
        alert(`Searching JamSpace registry for: "${query}"...\nRedirecting to filter view.`);
        window.location.href = `listings.html?search=${encodeURIComponent(query)}`;
    }

    // 3. CREATE EVENT SIMULATION (Homepage)
    const navCreateBtn = document.getElementById('nav-create-btn');
    const createModal = document.getElementById('create-event-modal');
    const closeCreateModalBtn = document.getElementById('close-create-modal');
    const createEventForm = document.getElementById('create-event-form');
    const featuredGrid = document.getElementById('featured-grid');

    if (navCreateBtn && createModal && closeCreateModalBtn) {
        navCreateBtn.addEventListener('click', () => {
            createModal.style.display = 'flex';
        });

        closeCreateModalBtn.addEventListener('click', () => {
            createModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === createModal) {
                createModal.style.display = 'none';
            }
        });
    }

    if (createEventForm && featuredGrid) {
        createEventForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('form-title').value;
            const category = document.getElementById('form-category').value;
            const date = document.getElementById('form-date').value;
            const venue = document.getElementById('form-venue').value;

            const imagePool = [
                'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
                'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500',
                'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500'
            ];
            const randomImg = imagePool[Math.floor(Math.random() * imagePool.length)];

            const newCard = document.createElement('article');
            newCard.className = 'event-card';
            newCard.innerHTML = `
                <div class="event-img" style="background: url('${randomImg}') center/cover;"></div>
                <div class="event-content">
                    <p class="event-date">${date} • ${category}</p>
                    <h3 class="event-title"><a href="details.html?id=mmu-tech">${title}</a></h3>
                    <p class="event-venue">${venue}</p>
                    <button class="btn-primary" onclick="window.location.href='details.html?id=mmu-tech'">View Details</button>
                </div>
            `;

            featuredGrid.insertBefore(newCard, featuredGrid.firstChild);
            createEventForm.reset();
            createModal.style.display = 'none';
            alert('Success! Event published system-wide on JamSpace.');
        });
    }

  

    if (window.location.pathname.includes("details.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        const event = eventsData[eventId] || eventsData["mmu-tech"];

        document.getElementById('det-title').textContent = event.title;
        document.getElementById('det-date').textContent = event.date;
        document.getElementById('det-desc').textContent = event.desc;
        document.getElementById('det-price').textContent = event.price;
        document.getElementById('det-banner').style.backgroundImage = `url('${event.image}')`;
        
        document.getElementById('det-vendor-name').textContent = event.vendorName;
        document.getElementById('det-vendor-rating').textContent = event.vendorRating;
        document.getElementById('det-vendor-desc').textContent = event.vendorDesc;
    }
});