// =========================================
// Personalized Guest Greeting
// =========================================

// ---------------------------
// Read guest from URL
// ---------------------------

const params = new URLSearchParams(window.location.search);

let guest = params.get("guest");

// Fall back to URL path if no ?guest=
if (!guest) {
    guest = window.location.pathname.replace(/^\/|\/$/g, "");
}

// ---------------------------
// Normalize supported formats
// Supports:
// ?guest=Haseena
// /Haseena
// /ChandraSekharSir
// /chandra-sekhar-sir
// /chandra_sekhar_sir
// ---------------------------

guest = guest
    .replace(/([a-z])([A-Z])/g, "$1 $2") // PascalCase
    .replace(/[-_]+/g, " ")              // Slugs & underscores
    .replace(/\s+/g, " ")                // Multiple spaces
    .trim();

// Stop if no guest
if (!guest) {
    console.log("No personalized guest detected.");
} else {

    // Convert to Title Case
    guest = guest.replace(/\b\w/g, c => c.toUpperCase());

    const footer = document.getElementById("guestGreeting");

    if (!footer) {
        console.warn("guestGreeting element not found.");
    } else {

        // ---------------------------
        // Greetings
        // ---------------------------

        const greetings = [

            `Dear <strong>${guest}</strong> ❤️`,
            `Assalamu Alaikum <strong>${guest}</strong> 🤍`,
            `Greetings, <strong>${guest}</strong> ❤️`,
            `To our wonderful guest, <strong>${guest}</strong> ❤️`,
            `With heartfelt gratitude, <strong>${guest}</strong> ❤️`,
            `A warm welcome to you <strong>${guest}</strong> ❤️`,
            `We're delighted to invite you <strong>${guest}</strong> ❤️`,
            `To our valued guest <strong>${guest}</strong> ❤️`,
            `With immense joy <strong>${guest}</strong> ❤️`,
            `A special welcome to <strong>${guest}</strong> ❤️`

        ];

        // ---------------------------
        // Appreciation
        // ---------------------------

        const appreciation = [

            "Your presence means the world to us.",

            "Sharing this beautiful day with you would be a true blessing.",

            "We are grateful to celebrate this joyous occasion with you.",

            "Your love and warm wishes make this celebration even more special.",

            "Having you with us is one of the greatest gifts we could ask for.",

            "Every smile shared with loved ones creates unforgettable memories.",

            "We truly appreciate your presence on our happiest day.",

            "Your blessings make this new chapter even more meaningful.",

            "We look forward to celebrating this beautiful journey together.",

            "Being surrounded by wonderful people like you makes this celebration complete."

        ];

        // ---------------------------
        // Closings
        // ---------------------------

        const closings = [

            "Thank you for your love & blessings. ❤️",

            "We can't wait to welcome you.",

            "Looking forward to celebrating together.",

            "See you on our special day! 🎉",

            "With love,<br><strong>Mr & Mrs Usman</strong>",

            "Your presence will make our day truly unforgettable.",

            "We sincerely hope to celebrate this wonderful occasion with you.",

            "Looking forward to making beautiful memories together.",

            "Thank you for being part of our journey.",

            "See you at the celebration! ❤️"

        ];

        // ---------------------------
        // Random Selection
        // ---------------------------

        const greeting =
            greetings[Math.floor(Math.random() * greetings.length)];

        const body =
            appreciation[Math.floor(Math.random() * appreciation.length)];

        const closing =
            closings[Math.floor(Math.random() * closings.length)];

        // ---------------------------
        // Smooth Fade
        // ---------------------------

        footer.style.transition = "opacity 0.6s ease";
        footer.style.opacity = "0";

        setTimeout(() => {

            footer.innerHTML = `
                ${greeting}
                <br><br>
                ${body}
                ${closing}
            `;

            footer.style.opacity = "1";

        }, 300);

    }

}