// Test script to verify cart endpoint
// Run this in browser console after logging in

console.log('=== CART DEBUG TEST ===');
console.log('Token:', localStorage.getItem('funkoshop_token'));
console.log('User:', localStorage.getItem('funkoshop_user'));

// Test API call
fetch('http://localhost:8000/shop/cart', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('funkoshop_token')}`
    },
    body: JSON.stringify({
        product_id: 5,
        quantity: 1
    })
})
    .then(res => {
        console.log('Response status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Response data:', data);
    })
    .catch(err => {
        console.error('Error:', err);
    });
