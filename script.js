// Main JavaScript file for Online Examination System

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userType = document.getElementById('userType').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!userType || !username || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate login process
            alert(`Login attempted as ${userType} with username: ${username}`);
            
            // Redirect based on user type
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
            }
        });
    }

    // Dashboard button functionality
    const dashboardButtons = document.querySelectorAll('.dashboard-card .btn, table .btn');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            switch(buttonText) {
                case 'Start Exam':
                    alert('Starting exam... This would navigate to the exam interface.');
                    break;
                case 'View Results':
                    alert('Showing exam results...');
                    break;
                case 'Evaluate':
                    alert('Opening evaluation interface...');
                    break;
                case 'Create New Exam':
                    alert('Opening exam creation form...');
                    break;
                case 'Add New User':
                    alert('Opening user creation form...');
                    break;
                default:
                    // For other buttons, just show a generic message
                    if (buttonText !== 'Start Exam' && !this.disabled) {
                        alert(`Action: ${buttonText}`);
                    }
            }
        });
    });

    // Simulate exam timer (for future implementation)
    function initializeExamTimer() {
        const timerElement = document.querySelector('.timer');
        if (timerElement) {
            // This would be implemented in the actual exam interface
            console.log('Exam timer would be initialized here');
        }
    }

    // Initialize any exam-related functionality
    initializeExamTimer();

    // Responsive behavior for tables on small screens
    function handleTableResponsiveness() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (window.innerWidth < 768) {
                table.classList.add('responsive-table');
            } else {
                table.classList.remove('responsive-table');
            }
        });
    }

    window.addEventListener('resize', handleTableResponsiveness);
    handleTableResponsiveness();

    // Form validation for any future forms
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                input.style.borderColor = '#ddd';
            }
        });
        
        return isValid;
    }

    // Add form validation to all forms with required fields
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                alert('Please fill in all required fields');
            }
        });
    });
});

// Additional utility functions
const ExamSystem = {
    // Function to simulate starting an exam
    startExam: function(examId) {
        console.log(`Starting exam with ID: ${examId}`);
        // In a real implementation, this would redirect to the exam interface
        // window.location.href = `exam.html?id=${examId}`;
    },
    
    // Function to simulate submitting an exam
    submitExam: function(examId, answers) {
        console.log(`Submitting exam with ID: ${examId}`, answers);
        // In a real implementation, this would send data to the server
    },
    
    // Function to get exam results
    getResults: function(studentId, examId) {
        console.log(`Getting results for student ${studentId} and exam ${examId}`);
        // In a real implementation, this would fetch data from the server
    }
};