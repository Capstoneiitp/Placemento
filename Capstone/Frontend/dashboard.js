// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    const API_BASE_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.hostname === ''
        ? 'http://127.0.0.1:8000'
        : 'https://my-deployed-backend.com'; // TODO: Replace with real URL when deployed

    // Feature Importance Bar Chart Initialization
    const ctx = document.getElementById('skillBarChart');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'CGPA',
                    'DSA',
                    'Aptitude_test_score',
                    'LeetCode',
                    'College_Tier',
                    'HSC',
                    'CodeForces_Rating',
                    'Coding_Language_Known',
                    'Hackathons',
                    'SSC',
                    'Core_Subject_Knowledge',
                    'Projects',
                    'Intern',
                    'Communication_level',
                    'Certificate'
                ],
                datasets: [{
                    label: 'Feature Importance',
                    data: [0.130, 0.114, 0.090, 0.085, 0.084, 0.075, 0.071, 0.070, 0.061, 0.049, 0.043, 0.035, 0.030, 0.030, 0.028],
                    backgroundColor: '#0284c7',
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal Bar Chart
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#475569'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#0f172a',
                            font: {
                                size: 12,
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend as there's only one dataset
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        padding: 12,
                        cornerRadius: 8
                    }
                }
            }
        });
    }

    // Form Submission Logic for AI Placement Assessment
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Change button text to show loading state
            const submitBtn = predictionForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Analyzing Profile...";
            submitBtn.disabled = true;

            try {
                // Gather all inputs
                const params = new URLSearchParams({
                    college_tier: document.getElementById('college_tier').value,
                    cgpa: document.getElementById('cgpa').value,
                    coding_languages: document.getElementById('coding_languages').value,
                    dsa: document.getElementById('dsa').value,
                    core_subjects: document.getElementById('core_subjects').value,
                    internships: document.getElementById('internships').value,
                    projects: document.getElementById('projects').value,
                    communication: document.getElementById('communication').value,
                    leetcode: document.getElementById('leetcode').value,
                    codeforces: document.getElementById('codeforces').value,
                    certifications: document.getElementById('certifications').value,
                    hackathons: document.getElementById('hackathons').value,
                    hsc: document.getElementById('hsc').value,
                    ssc: document.getElementById('ssc').value,
                    aptitude: document.getElementById('aptitude').value
                });

                // Call Django API
                const response = await fetch(`${API_BASE_URL}/predict/?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch prediction");
                }

                const data = await response.json();

                // Save results to localStorage so analysis.html can read them
                localStorage.setItem('placement_prediction_results', JSON.stringify(data));

                // Redirect to analysis page
                window.location.href = 'analysis.html';

            } catch (error) {
                console.error("Prediction Error:", error);
                alert("Failed to analyze profile. Please ensure the Django server is running.");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
