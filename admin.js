// Admin Dashboard JavaScript
let currentUser = null;

// Initialize admin dashboard
function initAdminDashboard() {
    currentUser = checkAuth('admin');
    
    if (!currentUser) return;
    
    // Update welcome message
    document.getElementById('adminWelcome').textContent = `Welcome, ${currentUser.name}`;
    
    // Set up event listeners
    setupAdminEventListeners();
    
    // Load initial data
    updateAdminDashboard();
    
    // Set up auto-refresh
    setInterval(updateAdminDashboard, 3000);
}

// Set up admin event listeners
function setupAdminEventListeners() {
    const addUserForm = document.getElementById('addUserForm');
    const userSearch = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }
    
    if (userSearch) {
        userSearch.addEventListener('input', filterUsers);
    }
    
    if (roleFilter) {
        roleFilter.addEventListener('change', filterUsers);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterUsers);
    }
    
    // Close modal events
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAddUserModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const addUserModal = document.getElementById('addUserModal');
        if (e.target === addUserModal) {
            closeAddUserModal();
        }
    });
}

// Update admin dashboard
function updateAdminDashboard() {
    const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
    
    // Update statistics
    updateAdminStats(users);
    
    // Update user table
    renderUsersTable(users);
}

// Update admin statistics
function updateAdminStats(users) {
    const totalUsers = users.length;
    const totalStudents = users.filter(u => u.type === 'student').length;
    const totalExaminers = users.filter(u => u.type === 'examiner').length;
    const totalAdmins = users.filter(u => u.type === 'admin').length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('totalExaminers').textContent = totalExaminers;
    document.getElementById('totalAdmins').textContent = totalAdmins;
}

// Render users table
function renderUsersTable(users, filteredUsers = null) {
    const usersToRender = filteredUsers || users;
    const tableBody = document.getElementById('usersTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (usersToRender.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    usersToRender.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-badge role-${user.type}">${user.type.charAt(0).toUpperCase() + user.type.slice(1)}</span></td>
            <td>${user.department}</td>
            <td><span class="status-badge status-${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>${user.registrationDate}</td>
            <td>
                <button class="btn btn-outline" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-warning" onclick="resetUserPassword('${user.id}')">Reset Password</button>
                ${user.type !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter users
function filterUsers() {
    const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const roleFilterValue = document.getElementById('roleFilter').value;
    const statusFilterValue = document.getElementById('statusFilter').value;
    
    let filteredUsers = users;
    
    // Apply search filter
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.id.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply role filter
    if (roleFilterValue !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.type === roleFilterValue);
    }
    
    // Apply status filter
    if (statusFilterValue !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilterValue);
    }
    
    renderUsersTable(users, filteredUsers);
}

// Show add user modal
function showRegisterModal() {
    const addUserModal = document.getElementById('addUserModal');
    const addUserAlert = document.getElementById('addUserAlert');
    
    if (addUserModal && addUserAlert) {
        addUserModal.style.display = 'flex';
        addUserAlert.innerHTML = '';
        
        const addUserForm = document.getElementById('addUserForm');
        if (addUserForm) {
            addUserForm.reset();
        }
    }
}

// Close add user modal
function closeAddUserModal() {
    const addUserModal = document.getElementById('addUserModal');
    if (addUserModal) {
        addUserModal.style.display = 'none';
    }
}

// Handle add user form submission
function handleAddUser(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('addFullName').value;
    const email = document.getElementById('addEmail').value;
    const userId = document.getElementById('addUserId').value;
    const department = document.getElementById('addDepartment').value;
    const password = document.getElementById('addPassword').value;
    const confirmPassword = document.getElementById('addConfirmPassword').value;
    const userType = document.getElementById('addUserType').value;
    const addUserAlert = document.getElementById('addUserAlert');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showAlert(addUserAlert, 'Passwords do not match!', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
    if (users.find(u => u.id === userId || u.email === email)) {
        showAlert(addUserAlert, 'User with this ID or email already exists!', 'error');
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
    showAlert(addUserAlert, 'User created successfully!', 'success');
    
    // Update dashboard and close modal after delay
    setTimeout(() => {
        closeAddUserModal();
        updateAdminDashboard();
    }, 1500);
}

// Edit user (placeholder function)
function editUser(userId) {
    alert(`Edit user functionality for ${userId} would be implemented here.`);
}

// Reset user password (placeholder function)
function resetUserPassword(userId) {
    alert(`Reset password functionality for ${userId} would be implemented here.`);
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('universityUsers', JSON.stringify(updatedUsers));
        updateAdminDashboard();
        
        const userAlert = document.getElementById('userAlert');
        showAlert(userAlert, 'User deleted successfully!', 'success');
    }
}

// Show alert message
function showAlert(container, message, type) {
    if (container) {
        container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    }
}

// Initialize admin dashboard when page loads
document.addEventListener('DOMContentLoaded', initAdminDashboard);