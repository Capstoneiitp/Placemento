// ================================
// NAVIGATION LOGIC
// ================================
function navigate(targetId) {

    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
    });

    document.getElementById('section-' + targetId).classList.add('active');

    const activeNav = document.getElementById('nav-' + targetId);

    if (activeNav && targetId !== 'login' && targetId !== 'register') {
        activeNav.classList.add('active-link');
    }

    const panel = document.getElementById('main-panel');

    if (targetId === 'login' || targetId === 'register') {
        panel.classList.remove('wide');
    } else {
        panel.classList.add('wide');
    }
}


// ================================
// PARTICLE BACKGROUND
// ================================
tsParticles.load('particles-js', {
    particles: {
        number: {
            value: 110,
            density: {
                enable: true,
                area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.6
        },
        size: {
            value: {
                min: 1,
                max: 3
            }
        },
        links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.5,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            outModes: {
                default: "out"
            }
        }
    },

    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: ["repel", "bubble"]
            },
            resize: true
        },

        modes: {
            repel: {
                distance: 150,
                duration: 0.4
            },

            bubble: {
                distance: 200,
                size: 6,
                duration: 0.3,
                opacity: 1
            }
        }
    },

    detectRetina: true
});


// ================================
// CLEAR PREVIOUS SESSION
// ================================
function clearUserSession() {

    const keysToRemove = [
        'placemento_user_name',
        'placemento_user_email',
        'placemento_user_phone',
        'placemento_user_branch',
        'placemento_user_grad_year',
        'placemento_user_pic',
        'placement_prediction_results'
    ];

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
}


// ================================
// LOGIN + REGISTER LOGIC
// ================================
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const API_BASE_URL =
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === ''
            ? 'http://127.0.0.1:8000'
            : 'https://my-deployed-backend.com';


    // =================================
    // LOGIN
    // =================================
    if (loginForm) {

        loginForm.addEventListener('submit', async (e) => {

            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const submitBtn = loginForm.querySelector('button[type="submit"]');

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Logging in...";
            submitBtn.disabled = true;

            try {

                const response = await fetch(`${API_BASE_URL}/login/`, {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {

                    clearUserSession();

                    localStorage.setItem(
                        'placemento_user_email',
                        email
                    );

                    alert(data.message);

                    window.location.href = 'dashboard.html';

                } else {

                    alert('Login failed: ' + data.error);
                }

            } catch (error) {

                console.error('Error logging in:', error);

                alert(
                    'Could not connect to the server. Please ensure the Django backend is running.'
                );

            } finally {

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }


    // =================================
    // REGISTER
    // =================================
    if (registerForm) {

        registerForm.addEventListener('submit', async (e) => {

            e.preventDefault();

            const name = document.getElementById('reg-name').value;

            const email = document.getElementById('reg-email').value;

            const password = document.getElementById('reg-password').value;

            const submitBtn =
                registerForm.querySelector('button[type="submit"]');

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Creating Account...";
            submitBtn.disabled = true;

            try {

                const response = await fetch(`${API_BASE_URL}/register/`, {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {

                    clearUserSession();

                    localStorage.setItem(
                        'placemento_user_name',
                        name
                    );

                    localStorage.setItem(
                        'placemento_user_email',
                        email
                    );

                    alert(data.message);

                    window.location.href = 'dashboard.html';

                } else {

                    alert('Registration failed: ' + data.error);
                }

            } catch (error) {

                console.error('Error registering:', error);

                alert(
                    'Could not connect to the server. Please ensure the Django backend is running.'
                );

            } finally {

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});