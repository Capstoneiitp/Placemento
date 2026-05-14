document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.hostname === ''
        ? 'http://127.0.0.1:8000'
        : 'https://my-deployed-backend.com'; // TODO: Replace with real URL when deployed

    // 0. Populate profile fields from localStorage
    const storedName = localStorage.getItem('placemento_user_name');
    const storedEmail = localStorage.getItem('placemento_user_email');
    const nameField = document.getElementById('settings-name');
    const emailField = document.getElementById('settings-email');
    const phoneField = document.getElementById('settings-phone');
    const branchField = document.getElementById('settings-branch');
    const gradField = document.getElementById('settings-grad-year');

    if (nameField && storedName) nameField.value = storedName;
    if (emailField && storedEmail) emailField.value = storedEmail;
    if (phoneField) phoneField.value = localStorage.getItem('placemento_user_phone') || '';
    if (branchField) branchField.value = localStorage.getItem('placemento_user_branch') || '';
    if (gradField) gradField.value = localStorage.getItem('placemento_user_grad_year') || '';

    // 1. Handle all action buttons
    const buttons = document.querySelectorAll('.settings-card button');
    
    buttons.forEach(button => {
        // Skip buttons that already have inline onclick handlers (like navigation)
        if (button.hasAttribute('onclick')) return;

        button.addEventListener('click', (e) => {
            const btnText = e.target.textContent.trim();
            
            switch(btnText) {
                case 'Save Profile':
                    // Read the current values from the input fields
                    let newName = document.getElementById('settings-name')?.value.trim() || '';
                    let newPhone = document.getElementById('settings-phone')?.value.trim() || '';
                    let newBranch = document.getElementById('settings-branch')?.value.trim() || '';
                    let newGradYear = document.getElementById('settings-grad-year')?.value.trim() || '';

                    const userEmail = localStorage.getItem('placemento_user_email');

                    if (!newName) {
                        showNotification('Name cannot be empty!', 'danger');
                        break;
                    }

                    // Call the Django backend to update the name in the database
                    fetch(`${API_BASE_URL}/update-profile/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newName, email: userEmail })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Also update localStorage so the dashboard reflects the change immediately
                            localStorage.setItem('placemento_user_name', newName);
                            localStorage.setItem('placemento_user_phone', newPhone);
                            localStorage.setItem('placemento_user_branch', newBranch);
                            localStorage.setItem('placemento_user_grad_year', newGradYear);
                            
                            showNotification('Profile updated successfully!', 'success');
                        } else {
                            showNotification('Failed to update: ' + data.message, 'danger');
                        }
                    })
                    .catch(() => showNotification('Could not connect to server.', 'danger'));
                    break;
                case 'Upload Image':
                    // This is now handled by the ID-based listener below
                    break;
                case 'Update':
                    // This is now handled by the ID-based listener below
                    break;
                case 'Reset':
                    showNotification('Password recovery email sent!', 'success');
                    break;
                case 'Delete':
                    const confirmDelete = confirm('Are you sure you want to permanently delete your account? This action cannot be undone.');
                    if (confirmDelete) {
                        const email = localStorage.getItem('placemento_user_email');
                        
                        fetch(`${API_BASE_URL}/delete-account/`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === 'success') {
                                // Clear all user data from localStorage
                                localStorage.clear();
                                alert('Your account has been deleted successfully.');
                                window.location.href = 'index.html';
                            } else {
                                showNotification('Failed to delete: ' + data.message, 'danger');
                            }
                        })
                        .catch(() => showNotification('Could not connect to server.', 'danger'));
                    }
                    break;
                case 'Clear Data':
                    const confirmClear = confirm('Are you sure you want to clear your AI chat history?');
                    if (confirmClear) {
                        showNotification('Chat history cleared successfully.', 'success');
                    }
                    break;
            }
        });
    });

    // 2. Handle Toggles (Checkboxes)
    const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
    
    toggles.forEach((toggle, index) => {
        // Simulate loading state from localStorage so preferences persist across reloads
        const toggleKey = `placemento_setting_toggle_${index}`;
        const savedState = localStorage.getItem(toggleKey);
        
        if (savedState !== null) {
            toggle.checked = savedState === 'true';
        }

        toggle.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            
            // Save state to localStorage
            localStorage.setItem(toggleKey, isChecked);
            
            // Determine which toggle was clicked based on its index
            let toggleName = index === 0 ? "AI Suggestions" : "Save Conversations";
            let status = isChecked ? "Enabled" : "Disabled";
            
            showNotification(`${toggleName} ${status}`, 'info');
        });
    });

    // 3. Simple Toast Notification System
    function showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.textContent = message;
        
        Object.assign(notif.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            fontSize: '14px',
            zIndex: '9999',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transform: 'translateY(20px)',
            opacity: '0',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
        });

        if (type === 'success') {
            notif.style.backgroundColor = '#10B981';
        } else if (type === 'danger') {
            notif.style.backgroundColor = '#EF4444';
        } else {
            notif.style.backgroundColor = '#3B82F6';
        }

        document.body.appendChild(notif);

        requestAnimationFrame(() => {
            notif.style.transform = 'translateY(0)';
            notif.style.opacity = '1';
        });

        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateY(20px)';
            setTimeout(() => {
                notif.remove();
            }, 300);
        }, 3000);
    }

    // 4. Password Modal Logic
    const passwordModal = document.getElementById('password-modal');
    const openModalBtn = document.getElementById('open-password-modal');
    const closeModalBtn = document.getElementById('close-password-modal');
    const changePasswordForm = document.getElementById('change-password-form');

    if (openModalBtn) {
        openModalBtn.onclick = () => {
            passwordModal.style.display = 'flex';
        };
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            passwordModal.style.display = 'none';
        };
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target == passwordModal) {
            passwordModal.style.display = 'none';
        }
    };

    if (changePasswordForm) {
        changePasswordForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const old_password = document.getElementById('old-password').value;
            const new_password = document.getElementById('new-password').value;
            const confirm_password = document.getElementById('confirm-password').value;
            const email = localStorage.getItem('placemento_user_email');

            if (new_password !== confirm_password) {
                showNotification('New passwords do not match!', 'danger');
                return;
            }

            if (new_password.length < 6) {
                showNotification('Password must be at least 6 characters long.', 'danger');
                return;
            }

            const submitBtn = changePasswordForm.querySelector('button');
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_BASE_URL}/change-password/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, old_password, new_password })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    showNotification('Password changed successfully!', 'success');
                    passwordModal.style.display = 'none';
                    changePasswordForm.reset();
                } else {
                    showNotification(data.message, 'danger');
                }
            } catch (error) {
                showNotification('Could not connect to server.', 'danger');
            } finally {
                submitBtn.textContent = 'Update Password';
                submitBtn.disabled = false;
            }
        };
    }

    // 5. Profile Picture Upload Logic
    const picInput = document.getElementById('profile-pic-input');
    const uploadBtn = document.getElementById('upload-pic-btn');
    const profileImg = document.querySelector('.user-profile img');

    // Load existing profile pic if any
    const savedPic = localStorage.getItem('placemento_user_pic');
    if (savedPic && profileImg) {
        profileImg.src = savedPic;
    }

    if (uploadBtn && picInput) {
        uploadBtn.onclick = () => picInput.click();

        picInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 1024 * 1024) { // 1MB limit for localStorage
                    showNotification('Image too large. Please select an image under 1MB.', 'danger');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    localStorage.setItem('placemento_user_pic', base64Image);
                    if (profileImg) profileImg.src = base64Image;
                    
                    // Update all other images on the page (e.g. sidebar if any)
                    document.querySelectorAll('.user-profile img').forEach(img => {
                        img.src = base64Image;
                    });
                    
                    showNotification('Profile picture updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
    }
});
