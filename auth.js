// auth.js - Complete Working Version
let selectedUserType = 'student';

// Initialize authentication system
function initAuth() {
    console.log('Auth system initializing...');
    
    // Check if users exist in localStorage, if not create empty array
    if (!localStorage.getItem('universityUsers')) {
        localStorage.setItem('universityUsers', JSON.stringify([]));
        console.log('Created empty users array in localStorage');
    }
    
    // Set up event listeners
    setupAuthEventListeners();
    
    // Check if user is already logged in
    checkExistingSession();
}

// Set up authentication event listeners
function setupAuthEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    console.log('Setting up event listeners...');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener added');
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('Register form listener added');
    }
    
    // Close modal events
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeRegisterModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const registerModal = document.getElementById('registerModal');
        if (e.target === registerModal) {
            closeRegisterModal();
        }
    });
    
    console.log('All event listeners set up');
}

// Check if user has an existing session
function checkExistingSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        redirectToDashboard(currentUser.type);
    }
}

// Select user type
function selectUserType(type) {
    selectedUserType = type;
    
    // Update UI
    document.querySelectorAll('.user-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    console.log('Selected user type:', type);
}

// Show register modal
function showRegister() {
    const registerModal = document.getElementById('registerModal');
    const registerAlert = document.getElementById('registerAlert');
    
    if (registerModal && registerAlert) {
        registerModal.style.display = 'flex';
        registerAlert.innerHTML = '';
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.reset();
        }
    }
}

// Close register modal
function closeRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.style.display = 'none';
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginAlert = document.getElementById('loginAlert');
    
    console.log('Login attempt:', { username, password, selectedUserType });
    
    // Validate inputs
    if (!username || !password) {
        showAlert(loginAlert, 'Please fill in all fields!', 'error');
        return;
    }
    
    // Authenticate user
    const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
    const user = users.find(u => 
        (u.id === username || u.email === username) && 
        u.password === password && 
        u.type === selectedUserType
    );
    
    if (user) {
        // Save current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success message
        showAlert(loginAlert, `Login successful! Welcome ${user.name}`, 'success');
        
        // Redirect to appropriate dashboard after delay
        setTimeout(() => {
            redirectToDashboard(user.type);
        }, 1500);
    } else {
        showAlert(loginAlert, 'Invalid username, password, or user type selected!', 'error');
    }
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();
    console.log('Register form submitted');
    
    const fullName = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const userId = document.getElementById('regUserId').value;
    const department = document.getElementById('regDepartment').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const userType = document.getElementById('regUserType').value;
    const registerAlert = document.getElementById('registerAlert');
    
    // Validate all fields
    if (!fullName || !email || !userId || !department || !password || !confirmPassword || !userType) {
        showAlert(registerAlert, 'Please fill in all fields!', 'error');
        return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert(registerAlert, 'Passwords do not match!', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
    if (users.find(u => u.id === userId || u.email === email)) {
        showAlert(registerAlert, 'User with this ID or email already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: userId,
        name: fullName,
        email: email,
        password: password,
        type: userType,
        department: department,
        status: 'active',
        registrationDate: new Date().toISOString().split('T')[0]
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('universityUsers', JSON.stringify(users));
    
    // Show success message
    showAlert(registerAlert, 'Account created successfully! You can now login.', 'success');
    
    // Close modal and reset form after delay
    setTimeout(() => {
        closeRegisterModal();
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.reset();
        }
    }, 2000);
}

// Redirect to appropriate dashboard
function redirectToDashboard(userType) {
    console.log('Redirecting to dashboard:', userType);
    switch(userType) {
        case 'student':
            window.location.href = 'student-dashboard.html';
            break;
        case 'examiner':
            window.location.href = 'examiner-dashboard.html';
            break;
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        default:
            window.location.href = 'index1.html';
    }
}

// Show alert message
function showAlert(container, message, type) {
    if (container) {
        container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Check authentication on dashboard pages
function checkAuth(requiredType) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    
    if (requiredType && currentUser.type !== requiredType) {
        window.location.href = 'login.html';
        return null;
    }
    
    return currentUser;
}

// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing auth...');
    initAuth();
});