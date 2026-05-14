document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the user information from localStorage
    const userName = localStorage.getItem('placemento_user_name');
    const userEmail = localStorage.getItem('placemento_user_email');
    const userBranch = localStorage.getItem('placemento_user_branch');
    const userGradYear = localStorage.getItem('placemento_user_grad_year');
    const userPic = localStorage.getItem('placemento_user_pic');

    if (userName) {
        // 1. Update the main welcome header on the dashboard
        const welcomeHeader = document.querySelector('.dash-header h2');
        if (welcomeHeader && welcomeHeader.textContent.includes('Welcome back')) {
            // Get just the first name for the greeting
            const firstName = userName.split(' ')[0];
            welcomeHeader.innerHTML = `Welcome back, ${firstName}! 👋`;
        }

        // 2. Update the profile name box in the header
        const profileName = document.getElementById('profile-name');
        if (profileName) {
            profileName.textContent = userName;
        }

        // 3. Update the profile subtitle (Branch, Year)
        const profileSubtitle = document.getElementById('profile-subtitle');
        if (profileSubtitle) {
            const branch = userBranch || 'Computer Science';
            const year = userGradYear ? `Year ${userGradYear}` : 'Year 3';
            profileSubtitle.textContent = `${branch}, ${year}`;
        }

        // 3. Update the Full Name input field on the Settings page
        // We look for the input immediately following the label "Full Name"
        const labels = document.querySelectorAll('.form-label');
        labels.forEach(label => {
            if (label.textContent.trim() === 'Full Name') {
                const input = label.nextElementSibling;
                if (input && input.tagName === 'INPUT') {
                    input.value = userName;
                }
            }
        });
    }

    if (userEmail) {
        // 4. Update the Email input field on the Settings page
        const labels = document.querySelectorAll('.form-label');
        labels.forEach(label => {
            if (label.textContent.trim() === 'Email') {
                const input = label.nextElementSibling;
                if (input && input.tagName === 'INPUT') {
                    input.value = userEmail;
                }
            }
        });
    }

    // 5. Update Profile Picture across all pages
    if (userPic) {
        document.querySelectorAll('.user-profile img').forEach(img => {
            img.src = userPic;
        });
    }
});
