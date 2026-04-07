const db = require('./database');

// All 15 bidirectional routes between the 6 NITC campus locations
// These match the ROUTE_FARES table in the frontend constants.js exactly.
const predefinedRoutes = [
    // Ambience Hostel
    { start: 'Ambience Hostel',      end: 'Ladies Hostel',       fare: 40 },
    { start: 'Ambience Hostel',      end: 'Mega Boys Hostel',    fare: 35 },
    { start: 'Ambience Hostel',      end: 'MBA Hostel',          fare: 30 },
    { start: 'Ambience Hostel',      end: 'Chemical Engg Block', fare: 50 },
    { start: 'Ambience Hostel',      end: 'Architecture Block',  fare: 55 },
    // Ladies Hostel
    { start: 'Ladies Hostel',        end: 'Mega Boys Hostel',    fare: 30 },
    { start: 'Ladies Hostel',        end: 'MBA Hostel',          fare: 35 },
    { start: 'Ladies Hostel',        end: 'Chemical Engg Block', fare: 50 },
    { start: 'Ladies Hostel',        end: 'Architecture Block',  fare: 45 },
    // Mega Boys Hostel
    { start: 'Mega Boys Hostel',     end: 'MBA Hostel',          fare: 25 },
    { start: 'Mega Boys Hostel',     end: 'Chemical Engg Block', fare: 40 },
    { start: 'Mega Boys Hostel',     end: 'Architecture Block',  fare: 45 },
    // MBA Hostel
    { start: 'MBA Hostel',           end: 'Chemical Engg Block', fare: 35 },
    { start: 'MBA Hostel',           end: 'Architecture Block',  fare: 40 },
    // Chemical Engg Block
    { start: 'Chemical Engg Block',  end: 'Architecture Block',  fare: 30 },
];

console.log('Starting route seeding process...');

predefinedRoutes.forEach(route => {
    const query = `
        INSERT OR IGNORE INTO routes (start_location, end_location, base_fare)
        VALUES (?, ?, ?)
    `;
    db.run(query, [route.start, route.end, route.fare], function(err) {
        if (err) {
            console.error(`Error inserting: ${route.start} -> ${route.end}`, err.message);
        } else if (this.changes > 0) {
            console.log(`✅ Added: ${route.start} → ${route.end} | ₹${route.fare}`);
        } else {
            console.log(`  Already exists: ${route.start} → ${route.end}`);
        }
    });
});

setTimeout(() => {
    console.log('\n✅ Seeding finished! All 15 campus routes are ready.');
    process.exit(0);
}, 1500);
