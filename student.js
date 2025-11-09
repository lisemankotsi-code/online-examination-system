// Student Dashboard JavaScript
let currentUser = null;

// Initialize student dashboard
function initStudentDashboard() {
    currentUser = checkAuth('student');
    
    if (!currentUser) return;
    
    // Update welcome message
    document.getElementById('studentWelcome').textContent = `Welcome, ${currentUser.name}`;
    
    // Load initial data
    updateStudentDashboard();
}

// Update student dashboard
function updateStudentDashboard() {
    // This would typically load exam data from server
    // For now, we'll just display placeholder data
    const examsTable = document.getElementById('examsTable');
    const resultsTable = document.getElementById('resultsTable');
    
    if (examsTable) {
        examsTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    <p>No exams available at the moment.</p>
                    <p>Your examiner will notify you when exams are scheduled.</p>
                </td>
            </tr>
        `;
    }
    
    if (resultsTable) {
        resultsTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    <p>No exam results available yet.</p>
                    <p>Your results will appear here after you complete exams.</p>
                </td>
            </tr>
        `;
    }
}

// Initialize student dashboard when page loads
document.addEventListener('DOMContentLoaded', initStudentDashboard);