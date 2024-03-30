function showTab(tabName) {
    var liveTab = document.getElementById('live-tab');
    var scorecardTab = document.getElementById('scorecard-tab');
    var liveContent = document.getElementById('live-content');
    var scorecardContent = document.getElementById('scorecard-content');

    if (tabName === 'live') {
        liveTab.classList.add('active');
        scorecardTab.classList.remove('active');
        liveContent.style.display = 'table';
        scorecardContent.style.display = 'none';
    } else if (tabName === 'scorecard') {
        scorecardTab.classList.add('active');
        liveTab.classList.remove('active');
        scorecardContent.style.display = 'table';
        liveContent.style.display = 'none';
    }
}

// Add WebSocket initialization
const socket = new WebSocket('http://127.0.0.1:5500/DBMS%20Project/info-live-admin.html');

// WebSocket event listeners
socket.addEventListener('open', function (event) {
    console.log('WebSocket connection established.');
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    if (data.type === 'update') {
        updateLiveScore(data);
    }
});

// Update live score based on received data
function updateLiveScore(data) {
    // Update scorecard table
    const scorecardContent = document.getElementById("scorecard-content");
    scorecardContent.innerHTML += `
        <tr>
            <td>${data.currentBowler}</td>
            <td></td>
            <td>${data.overs}.${data.balls}</td>
            <td>${data.bmaiden}</td>
            <td>${data.bruns}</td>
            <td>${data.bwickets}</td>
            <td>${data.beconomy}</td>
        </tr>
    `;
}
