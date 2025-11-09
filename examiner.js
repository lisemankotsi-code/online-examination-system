// Examiner Dashboard JavaScript
let currentUser = null;

// Initialize examiner dashboard
function initExaminerDashboard() {
    currentUser = checkAuth('examiner');
    
    if (!currentUser) return;
    
    // Update welcome message
    document.getElementById('examinerWelcome').textContent = `Welcome, ${currentUser.name}`;
    
    // Load initial data
    updateExaminerDashboard();
    
    // Set up auto-refresh
    setInterval(updateExaminerDashboard, 3000);
}

// Update examiner dashboard
function updateExaminerDashboard() {
    const users = JSON.parse(localStorage.getItem('universityUsers') || '[]');
    const students = users.filter(u => u.type === 'student');
    
    // Update student count
    document.getElementById('examinerStudentCount').textContent = students.length;
    
    // Update student table
    renderStudentTable(students);
}

// Render student table
function renderStudentTable(students) {
    const tableBody = document.getElementById('examinerStudentsTable');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No students registered yet</td></tr>';
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td><span class="status-badge status-active">Active</span></td>
            <td>
                <button class="btn btn-outline" onclick="viewStudentDetails('${student.id}')">View Details</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// View student details (placeholder function)
function viewStudentDetails(studentId) {
    alert(`Student details for ${studentId} would be displayed here.`);
}

// Create exam (placeholder function)
function createExam() {
    alert('Create exam functionality would be implemented here.');
}

// Initialize examiner dashboard when page loads
document.addEventListener('DOMContentLoaded', initExaminerDashboard);