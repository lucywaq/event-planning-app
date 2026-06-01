document.addEventListener('DOMContentLoaded', () => {

    // 1. DATA SOURCE FOR FILTER ENGINE
    const jamSpaceCollection = [
        {
            id: "mmu-tech",
            title: "MMUTech Summit 2026",
            tag: "tech",
            date: "Oct 24 • Tech Innovations",
            venue: "MULTIMEDIA UNIVERSITY, Kenya",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500"
        },
        {
            id: "charity-run",
            title: "Charity RUN 2026",
            tag: "sports",
            date: "JUN 06 • Birth&Beyond",
            venue: "MARUAHUB, Ongata Rongai",
            image: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=500"
        },
        {
            id: "tech-gala",
            title: "Tech Enthusiasts Gala",
            tag: "business",
            date: "Nov 05 • Business",
            venue: "Nairobi KICC",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500"
        }
    ];

    const listingsGrid = document.getElementById('listings-grid');
    const searchStatus = document.getElementById('search-status');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 2. RENDER FUNCTION
    function renderCards(eventsList) {
        listingsGrid.innerHTML = '';

        if (eventsList.length === 0) {
            listingsGrid.innerHTML = `
                <div class="no-results">
                    <h3>No events found matching your query details.</h3>
                    <p style="margin-top: 5px;">Try adjusting your categories or check back later.</p>
                </div>`;
            return;
        }

        eventsList.forEach(event => {
            const card = document.createElement('article');
            card.className = 'event-card';
            card.innerHTML = `
                <div class="event-img" style="background: url('${event.image}') center/cover;"></div>
                <div class="event-content">
                    <p class="event-date">${event.date}</p>
                    <h3 class="event-title"><a href="./details.html?id=${event.id}">${event.title}</a></h3>
                    <p class="event-venue">${event.venue}</p>
                    <button class="btn-primary" onclick="window.location.href='./details.html?id=${event.id}'">View Details</button>
                </div>
            `;
            listingsGrid.appendChild(card);
        });
    }

    // 3. INITIAL URL SEARCH PARAMETER CHECK
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    let currentDisplayList = jamSpaceCollection;

    if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        currentDisplayList = jamSpaceCollection.filter(event => 
            event.title.toLowerCase().includes(query) || 
            event.venue.toLowerCase().includes(query)
        );
        
        // Expose search query text status to layout
        searchStatus.textContent = `Showing results for search parameter: "${searchQuery}"`;
        searchStatus.style.display = 'block';
        
        // Clear active category button state highlight
        filterButtons.forEach(btn => btn.classList.remove('active'));
    }

    // Run layout compile engine
    renderCards(currentDisplayList);

    // 4. CATEGORY FILTER BUTTON EVENTS
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Reset status text if manually clicking filters
            searchStatus.style.display = 'none';

            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const selectedCategory = e.target.getAttribute('data-category');

            if (selectedCategory === 'all') {
                renderCards(jamSpaceCollection);
            } else {
                const filtered = jamSpaceCollection.filter(item => item.tag === selectedCategory);
                renderCards(filtered);
            }
        });
    });
});