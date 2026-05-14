// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // 0. Load Data from Backend Prediction
    const resultsJSON = localStorage.getItem('placement_prediction_results');
    let userLevelData = [70, 50, 65, 75, 60, 55]; // default fallbacks
    let requiredLevelData = [85, 80, 75, 80, 70, 75]; // default required levels
    let probabilityHistory = [45, 52, 61, 70, 78]; // default history

    if (resultsJSON) {
        try {
            const results = JSON.parse(resultsJSON);
            
            // Update Top Stats
            const probText = document.getElementById('prob-text');
            if (probText) {
                probText.textContent = results.placement_probability + '%';
                document.getElementById('prob-circle-text').textContent = Math.round(results.placement_probability) + '%';
                
                const isPlaced = results.prediction === "Placed" || results.placement_probability >= 50;
                const probSub = document.getElementById('prob-subtext');
                probSub.textContent = isPlaced ? "High Chance of Placement" : "Needs Improvement";
                probSub.style.color = isPlaced ? "#16a34a" : "#ef4444";
                
                const readText = document.getElementById('readiness-text');
                readText.textContent = results.final_verdict ? results.final_verdict.split(' - ')[0] : results.prediction;
                readText.style.color = isPlaced ? "#16a34a" : "#ef4444";
                document.getElementById('readiness-subtext').textContent = results.final_verdict ? results.final_verdict.split(' - ')[1] : results.expected_job_level;
                
                // --- NEW DYNAMIC CHART DATA LOGIC ---
                // 1. Dynamic Required Levels based on expected job level
                if (results.expected_job_level === "High Paying Job Opportunity") {
                    requiredLevelData = [90, 85, 80, 85, 80, 85];
                } else if (results.expected_job_level === "Medium Paying Job Opportunity") {
                    requiredLevelData = [75, 70, 65, 70, 60, 70];
                } else {
                    requiredLevelData = [60, 55, 50, 55, 40, 50];
                }
                
                // 2. Dynamic Probability History ending at current score
                const finalProb = Math.round(results.placement_probability);
                probabilityHistory = [
                    Math.max(0, finalProb - 25), 
                    Math.max(0, finalProb - 18), 
                    Math.max(0, finalProb - 10), 
                    Math.max(0, finalProb - 4), 
                    finalProb
                ];

                // Calculate overall score from skill_scores
                if (results.skill_scores) {
                    const s = results.skill_scores;
                    userLevelData = [s.coding || 0, s.aptitude || 0, s.communication || 0, s.core_subjects || 0, s.projects || 0, s.tech_stack || 0];
                    
                    const totalScore = Math.round(userLevelData.reduce((a, b) => a + b, 0) / userLevelData.length);
                    document.getElementById('overall-score-text').innerHTML = `${totalScore}<span style="font-size: 16px; color: #64748b;">/100</span>`;
                    
                    const overSub = document.getElementById('overall-score-subtext');
                    overSub.textContent = totalScore >= 60 ? "Good - Keep Improving!" : "Needs significant work!";
                    overSub.style.color = totalScore >= 60 ? "#ca8a04" : "#ef4444";
                }

                // 3. Update Skill Analysis List Dynamically
                const skillList = document.getElementById('skill-analysis-list');
                if (skillList && results.skill_scores) {
                    const skills = [
                        { name: 'Coding and programming', key: 'coding' },
                        { name: 'Aptitude', key: 'aptitude' },
                        { name: 'Communication', key: 'communication' },
                        { name: 'Core Subjects', key: 'core_subjects' },
                        { name: 'Projects', key: 'projects' },
                        { name: 'Technical Stack', key: 'tech_stack' }
                    ];

                    let listHTML = `
                        <div class="skill-bar-header">
                            <span style="flex: 2;">Skill</span>
                            <span style="flex: 2; text-align: center;">Your Level</span>
                            <span style="flex: 1; text-align: right;">Required</span>
                            <span style="flex: 1; text-align: right;">Status</span>
                        </div>
                    `;

                    skills.forEach((skill, index) => {
                        const score = results.skill_scores[skill.key] || 0;
                        const req = requiredLevelData[index];
                        
                        let statusClass = 'badge-low';
                        let statusText = 'Low';
                        if (score >= req) {
                            statusClass = 'badge-good';
                            statusText = 'Good';
                        } else if (score >= req - 15) {
                            statusClass = 'badge-medium';
                            statusText = 'Medium';
                        }

                        let reqLabel = 'Medium';
                        if (req >= 80) reqLabel = 'High';
                        else if (req < 60) reqLabel = 'Low';

                        listHTML += `
                            <div class="skill-bar-item">
                                <span style="flex: 2; font-weight: 600; font-size: 14px;">${skill.name}</span>
                                <div style="flex: 2; display: flex; align-items: center; gap: 10px;">
                                    <div class="progress-bg"><div class="progress-fill" style="width: ${score}%;"></div></div>
                                    <span style="font-size: 12px; font-weight: bold;">${Math.round(score)}%</span>
                                </div>
                                <span style="flex: 1; text-align: right; font-size: 13px;">${reqLabel}</span>
                                <span style="flex: 1; text-align: right;"><span class="badge ${statusClass}">${statusText}</span></span>
                            </div>
                        `;
                    });
                    skillList.innerHTML = listHTML;
                }

                // 4. Update Skill Gap Insights Dynamically
                const gapContainer = document.getElementById('skill-gap-container');
                if (gapContainer && results.skill_gap_analysis) {
                    let gapHTML = '';
                    const gaps = results.skill_gap_analysis;
                    const gapIcons = {
                        academic: '🎓',
                        dsa: '</>',
                        aptitude: '📊',
                        projects: '📁',
                        experience: '💼',
                        communication: '💬'
                    };

                    Object.keys(gaps).forEach(key => {
                        const message = gaps[key];
                        if (message.includes('Improve') || message.includes('Build') || message.includes('Do')) {
                            gapHTML += `
                                <div class="insight-alert">
                                    <div class="insight-icon red-icon">${gapIcons[key] || '⚠️'}</div>
                                    <div class="insight-text">
                                        <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                                        <p>${message}</p>
                                        <div style="text-align: right; margin-top: 5px;"><span class="badge badge-low">Gap Detected</span></div>
                                    </div>
                                </div>
                            `;
                        }
                    });

                    if (gapHTML === '') {
                        gapHTML = '<p style="text-align: center; color: #16a34a; padding: 20px;">No major skill gaps detected! You are performing well across all categories.</p>';
                    }
                    gapContainer.innerHTML = gapHTML;
                }
            }
        } catch(e) { console.error("Error parsing results", e); }
    }

    // 1. Bar Chart Configuration (Skill Overview)
    const barCtx = document.getElementById('analysisBarChart');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Coding and programming', 'Aptitude', 'Communication', 'Core Subjects', 'Projects', 'Technical Stack'],
                datasets: [{
                    label: 'Your Level',
                    data: userLevelData,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)', // Vibrant Blue
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                    borderRadius: 4
                }, {
                    label: 'Required Level',
                    data: requiredLevelData,
                    backgroundColor: 'rgba(148, 163, 184, 0.3)', // Light Grey
                    borderColor: '#94A3B8',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 12 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: {
                            color: '#94A3B8',
                            font: { size: 12 },
                            stepSize: 20,
                            min: 0,
                            max: 100,
                            callback: function(value) { return value + '%'; }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, font: { size: 12 }, color: '#F8FAFC' }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#F8FAFC',
                        bodyColor: '#F8FAFC',
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // 2. Line Chart Configuration (Placement Probability Over Time)
    const lineCtx = document.getElementById('analysisLineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Placement Probability (%)',
                    data: probabilityHistory,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3B82F6',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 12 } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: {
                            color: '#94A3B8',
                            font: { size: 12 },
                            stepSize: 25,
                            min: 0,
                            max: 100,
                            callback: function(value) { return value + '%'; }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 10,
                        titleColor: '#F8FAFC',
                        bodyColor: '#F8FAFC',
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% Probability';
                            }
                        }
                    }
                }
            }
        });
    }
});
