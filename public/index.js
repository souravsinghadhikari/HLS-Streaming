// Show and hide loader
function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}
function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}

// Close video modal
function closeModal() {
  const modal = document.getElementById('modal');
  const video = document.getElementById('video');
  modal.classList.add('hidden');
  video.pause();
  video.src = '';
}

// Upload video function
async function uploadVideo() {
  const title = document.getElementById('title').value;
  const videoFile = document.getElementById('videoUpload').files[0];

  if (!videoFile) {
    alert('Please select a video to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('video', videoFile);

  showLoader();

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    hideLoader();

    if (response.ok) {
      document.getElementById('message').innerText = 'Upload successful!';
      fetchVideoList(); // Refresh the video list
    } else {
      document.getElementById('message').innerText = result.message || 'Upload failed.';
    }

  } catch (err) {
    hideLoader();
    document.getElementById('message').innerText = 'Error uploading video.';
  }
}

// Show video list (for now, based on existing folder structure)
async function fetchVideoList() {
  const videoList = document.getElementById('videoList');
  videoList.innerHTML = '';

  const titles = ['Sample1', 'Sample2']; // Replace with dynamic fetching if needed

  for (let title of titles) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="border p-4 rounded w-72 bg-gray-100 text-center shadow">
        <p class="font-bold">${title}</p>
        <button class="mt-2 bg-green-500 text-white px-4 py-1 rounded" onclick="playVideo('${title}')">Play</button>
      </div>
    `;
    videoList.appendChild(div);
  }
}

// Play video with HLS support
function playVideo(title) {
  const video = document.getElementById('video');
  const modal = document.getElementById('modal');
  const videoSrc = `/videos/${title}/master.m3u8`; // adjust if using different file name

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', function () {
      video.play();
    });
  }

  modal.classList.remove('hidden');
}

// Initial load
fetchVideoList();
